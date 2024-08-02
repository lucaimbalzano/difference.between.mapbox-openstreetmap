"use client";
import { useEffect, useRef, useState } from "react";
import Layout from "./layout";
import { VscActivateBreakpoints } from "react-icons/vsc";
import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { IoCube } from "react-icons/io5";
import { PiPolygonDuotone } from "react-icons/pi";
import Card from "../components/card";
import Link from "next/link";
import { RiHomeFill } from "react-icons/ri";
import { GiButterflyWarning } from "react-icons/gi";
import PolygonAccordion from "../components/accordion";
import loadingWorld from "../../assets/world_loading3.gif";
import Image from "next/image";
import {
  myStyle,
  addPolygonLayer,
  addSinglePolygonLayer,
  addLineLayer,
  createTileLayers,
} from "../uitls/layers";

export default function DrawPolygonsPage() {
  const mapRef = useRef<L.Map | null>(null);
  const checkboxRef = useRef(null);
  const [currentPolygon, setCurrentPolygon] = useState<L.Polygon | null>(null);
  const [addressesOSM, setAddressesOSM] = useState<any>(null);
  const geoJSONLayerRef = useRef<L.GeoJSON | null>(null);
  const [inputCodiceBelfiore, setInputCodiceBelfiore] = useState<string>("");
  const [inputValidation, setInputValidation] = useState<string>("");
  const [indiriziOsmFound, setIndirizziOsmFound] = useState<string>("");
  const [timeExecution, setTimeExecution] = useState<any>(null);
  const [loadingMap, setLoadingMap] = useState<boolean>(false);

  const title = (
    <div className="flex justify-start items-center space-x-2">
      <PiPolygonDuotone className="text-xl" />
      <p>Current Polygon</p>
    </div>
  );

  const [loadingAddressesInfo, setLoadingAddressesInfo] =
    useState<boolean>(false);

  const cleanState = () => {
    setCurrentPolygon(null);
    if (mapRef.current) {
      // Clear map layers
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          mapRef.current?.removeLayer(layer);
        }
      });
    }
  };

  const handleGetAddresses = async () => {
    setLoadingMap(true);
    setLoadingAddressesInfo(true);

    // Event listener for polygon removal
    mapRef.current.on("pm:remove", (e: any) => {
      const layer = e.layer;
      if (layer instanceof L.Polygon) {
        cleanState();
      }
    });

    await osmFunctionGetAddresses();
    setLoadingAddressesInfo(false);
    setLoadingMap(false);
  };

  const osmFunctionGetAddresses = async () => {
    if (inputCodiceBelfiore === "") {
      setInputValidation("Please enter a valid codice belfiore");
      setLoadingMap(false);
      return;
    } else {
      setInputValidation("");
    }

    let getDoublesAddresses = checkboxRef.current?.checked;
    let url = `http://localhost:3000/api/get-addresses/get-addresses-by-code-belfiore/geoms?codeBelfiore=${inputCodiceBelfiore}&getDoublesAddresses=${getDoublesAddresses}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!data || !data.geometries) {
      setInputValidation("No data found");
      setLoadingMap(false);
      return;
    }
    console.log(`Addresses found`, data.addresses_found);
    setIndirizziOsmFound(data.addresses_found);
    setAddressesOSM(data.addresses_list);
    setTimeExecution(data.execution_time);
    let geometries = data.geometries;

    let latViewMap = data.geometries[0][0][1];
    let lngViewMap = data.geometries[0][0][0];
    if (Array.isArray(data.geometries[0][0][1])) {
      latViewMap = data.geometries[0][0][1][1];
      lngViewMap = data.geometries[0][0][0][0];
    }

    if (!mapRef.current) {
      console.log("[MAP] Initializing the map");
      mapRef.current = L.map("map").setView([latViewMap, lngViewMap], 16);
    } else {
      console.log("[MAP] Updating the map view");
      mapRef.current.flyTo([latViewMap, lngViewMap], 13, { duration: 1.5 });
    }

    if (geoJSONLayerRef.current) {
      mapRef.current.removeLayer(geoJSONLayerRef.current);
    }

    if (geometries.length > 1) {
      addPolygonLayer(mapRef.current, geometries);
    } else {
      const polygonLayer = addSinglePolygonLayer(mapRef.current, geometries);
      setCurrentPolygon(polygonLayer);
      geoJSONLayerRef.current = polygonLayer;
    }

    let myLines = data.geometries_streets;
    addLineLayer(mapRef.current, myLines);
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(
        [45.45410069422155, 9.20329798212643],
        16
      );

      const {
        osm,
        osmHOT,
        Stadia_AlidadeSmoothDark,
        Stadia_AlidadeSmooth,
        Stadia_AlidadeSatellite,
        Stadia_StamenToner,
        Stadia_StamenWatercolor,
        Stadia_StamenTerrainBackground,
        OpenCycleMap,
        Transport,
        Landscape,
        Outdoors,
        TransportDark,
        SpinalMap,
        Pioneer,
        MobileAtlas,
        Neighbourhood,
        Atlas,
      } = createTileLayers();
      Transport.addTo(mapRef.current);

      L.control
        .layers({
          "Open StreetMap Default": osm,
          "Open StreetMap HOT": osmHOT,
          "Stadia Alidade SmoothDark": Stadia_AlidadeSmoothDark,
          "Stadia Alida Smooth": Stadia_AlidadeSmooth,
          "Stadia Alida Satellite": Stadia_AlidadeSatellite,
          Stadia_StamenToner,
          Stadia_StamenWatercolor,
          Stadia_StamenTerrainBackground,
          "Open cycle map": OpenCycleMap,
          Transport,
          Landscape,
          Outdoors,
          TransportDark,
          SpinalMap,
          Pioneer,
          MobileAtlas,
          Neighbourhood,
          Atlas,
        })
        .addTo(mapRef.current);

      mapRef.current.pm.addControls({
        position: "topleft",
        drawCircle: true,
      });

      mapRef.current.on("pm:create", (e: any) => {
        const layer = e.layer;
        if (layer instanceof L.Polygon) {
          setCurrentPolygon(layer);
        }
      });

      mapRef.current.on("pm:remove", (e: any) => {
        const layer = e.layer;
        if (layer instanceof L.Polygon) {
          cleanState();
        }
      });
    }
  }, []);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <div className="text-3xl text-opacity-70">
            <div className="flex space-x-5 m-8">
              <VscActivateBreakpoints className="m-2" />
              <p>Get Indirizzi by Comune (Codice Belfiore) with Layers</p>
            </div>
            <div className="flex">
              <Link href="/">
                <p className="text-sm text-gray-400 ml-5 mb-5 mt-3">
                  openstreetmap local database{" "}
                </p>
                <div className="mb-5 ml-5 text-sm text-blue-400 hover:text-blue-300 hover:text-scale-105 flex items-center">
                  <p>/</p>
                  <RiHomeFill />
                </div>
              </Link>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-4">
                {loadingAddressesInfo && (
                  <div className="text-gray-400 text-base m-3 flex items-center animate-pulse">
                    <Image
                      src={loadingWorld}
                      alt="Loading world"
                      width={50}
                      height={50}
                      className="mr-3"
                    />
                    <p className="ml-3">Loading addresses informations...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            id="map-container"
            className="relative w-full h-[600px] rounded-lg shadow-md"
          >
            <div id="map" className="w-full h-full rounded-lg"></div>
          </div>
          <div className="flex justify-start items-center space-x-4 mt-14">
            <button
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-white hover:text-blue-500 hover:shadow-lg hover:scale-105 hover:outline hover:outline-blue-500 transition duration-300 flex justify-center space-x-2 items-center"
              onClick={handleGetAddresses}
            >
              <IoCube />
              <p>Get addresses</p>
            </button>

            <div className="flex items-center space-x-3 text-red-500 hover:scale-115 hover:text-red-400">
              {inputValidation && (
                <>
                  <GiButterflyWarning />
                  <p>{inputValidation}</p>
                </>
              )}
            </div>
            <input
              onChange={(e) => setInputCodiceBelfiore(e.target.value)}
              type="text"
              placeholder=" 💠 Enter here codice belfiore..."
              value={inputCodiceBelfiore}
              className="bg-transparent border-1 border-gray-300 placeholder-gray-500 w-80 px-4 py-2 text-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-light-blue focus:border-transparent transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-light-blue hover:bg-opacity-20 mt-5 mb-2"
            />
          </div>
          <label className="flex items-center space-x-2 mt-3 mb-3">
            <span className="text-gray-500">Get double addresses</span>
            <input
              ref={checkboxRef}
              id="my-checkbox"
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-400 border border-gray-300 bg-transparent checked:border-blue-300 checked:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out hover:sclae-115"
            />
          </label>

          <div className="text-gray-400">
            <PolygonAccordion currentPolygon={currentPolygon} title={title} />
          </div>
        </div>
        <div className="flex flex-wrap w-full items-center justify-center">
          {addressesOSM && (
            <Card osm={addressesOSM} indirizzi_osm_found={indiriziOsmFound} />
          )}
        </div>
      </main>
    </Layout>
  );
}
