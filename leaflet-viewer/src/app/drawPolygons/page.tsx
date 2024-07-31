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
import * as turf from "@turf/turf";
import { convertLineStringToPolygon } from "../uitls/functions";
import "leaflet-iconmaterial";
import Link from "next/link";
import { RiHomeFill } from "react-icons/ri";

export default function DrawPolygonsPage() {
  const mapRef = useRef<L.Map | null>(null);
  const [currentPolygon, setCurrentPolygon] = useState<L.Polygon | null>(null);
  const [addressesMapBox, setAddressesMapBox] = useState<any>(null);
  const [addressesOSM, setAddressesOSM] = useState<any>(null);
  const [loadingAddressesInfo, setLoadingAddressesInfo] =
    useState<boolean>(false);

  var busIcon = L.IconMaterial.icon({
    icon: "", // Name of Material icon
    iconColor: "#aa2187", // Material icon color (could be rgba, hex, html name...)
    markerColor: "rgba(1, 64, 187, 0.5)", // Marker fill color
    outlineColor: "yellow", // Marker outline color
    outlineWidth: 1, // Marker outline width
    iconSize: [31, 42], // Width and height of the icon
  });

  const cleanState = () => {
    console.log("Cleaning state");
    setCurrentPolygon(null);
  };

  const handleGetAddresses = async () => {
    if (currentPolygon) {
      setLoadingAddressesInfo(true);
      console.log(
        "Polygon created with coordinates:",
        currentPolygon.getLatLngs()
      );
      await mapBoxFunctionGetAddresses(
        JSON.stringify(currentPolygon.getLatLngs())
      );
      await osmFunctionGetAddresses(
        JSON.stringify(currentPolygon.getLatLngs())
      );

      setLoadingAddressesInfo(false);
    } else {
      console.log("Error in the polygon creation");
    }
  };

  const osmFunctionGetAddresses = async (coordinates: any) => {
    const response = await fetch(
      "http://localhost:3000/api/get-addresses/get-addresses-by-polygon/db",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: coordinates,
      }
    );

    const data = await response.json();
    const dataRetrieved = JSON.parse(data);
    setAddressesOSM(dataRetrieved.addresses);
    console.log("osm addresses", JSON.stringify(dataRetrieved.addresses));
    // Cycle to design the inner polygons perimeters
    let myLines = dataRetrieved.addresses.indirizzi_osm.list_geomtries;

    var myStyle = {
      color: "#ff7800",
      weight: 5,
      opacity: 0.65,
    };

    L.geoJSON(myLines, {
      style: myStyle,
    }).addTo(mapRef.current);
  };

  const mapBoxFunctionGetAddresses = async (coordinates: any) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/get-addresses/draw-inner-polygons-perimeter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: coordinates,
        }
      );

      const data = await response.json();
      const dataRetrieved = JSON.parse(data);
      setAddressesMapBox(dataRetrieved.addresses);
      console.log("addresses", JSON.stringify(dataRetrieved.addresses));
      console.log("Data retrieved:", dataRetrieved.coordinates);

      // Convert the array of objects into an array of [lng, lat] arrays
      let coordinatesArrayObjectLngLat = JSON.parse(coordinates)[0].map(
        (coord: any) => [coord.lng, coord.lat]
      );
      coordinatesArrayObjectLngLat.push([
        JSON.parse(coordinates)[0][0].lng,
        JSON.parse(coordinates)[0][0].lat,
      ]);

      L.geoJSON(
        {
          type: "Polygon",
          coordinates: [coordinatesArrayObjectLngLat],
        },
        {
          style: {
            color: "blue",
            fillOpacity: 0.2,
          },
        }
      ).addTo(mapRef.current);

      // Add a marker at the centroid of the outer polygon
      const outerPolygon = turf.polygon([coordinatesArrayObjectLngLat]);
      const centroid = turf.centroid(outerPolygon).geometry.coordinates;
      L.marker([centroid[1], centroid[0]], { icon: busIcon })
        .addTo(mapRef.current)
        .bindPopup("Centroid");
      console.log("Centroid:", centroid[1], centroid[0]);

      // Cycle to design the inner polygons perimeters
      dataRetrieved.coordinates.innerPolygons.forEach((polygon: any) => {
        console.log("Polygon:", polygon);
        L.geoJSON(polygon, {
          style: {
            color: "red",
            fillOpacity: 0.1,
          },
        }).addTo(mapRef.current);
      });

      // Cycle to design the inner polygons perimeters points geoJson
      dataRetrieved.coordinates.pointsPerimeterPolygons.forEach(
        (polygonPerimeter: any) => {
          polygonPerimeter.forEach((point: any, index: number) => {
            console.log("[" + index + "]Point:", point[0], point[1]);
            L.marker([point[1], point[0]], { icon: busIcon }, { opacity: 0.5 })
              .addTo(mapRef.current)
              .bindPopup("Marker number: " + index);
          });
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map("map").setView(
        [45.45410069422155, 9.20329798212643],
        16
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Enable Geoman controls
      mapRef.current.pm.addControls({
        position: "topleft",
        drawCircle: true,
      });

      // Example event listener for polygon creation
      mapRef.current.on("pm:create", (e: any) => {
        const layer = e.layer;
        if (layer instanceof L.Polygon) {
          const polygonCoordinates = layer.getLatLngs();
          setCurrentPolygon(layer);
        }
      });

      // Event listener for polygon removal
      mapRef.current.on("pm:remove", (e: any) => {
        const layer = e.layer;
        if (layer instanceof L.Polygon) {
          cleanState();
        }
      });
    }
  }, []);

  console.log("Addresses MapBox:", addressesMapBox);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <div className="text-3xl text-opacity-70">
            <div className="flex space-x-4 m-8">
              <VscActivateBreakpoints /> <p>Draw Polygons Page</p>
            </div>
            <Link href="/">
              <p className="mb-5 ml-5 text-sm text-blue-400 hover:text-blue-300 hover:text-scale-105 flex items-center">
                <p>/</p>
                <RiHomeFill />
              </p>
            </Link>
          </div>
          <div
            id="map-container"
            className="w-full h-[600px] rounded-lg shadow-md"
          >
            <div id="map" className="w-full h-full rounded-lg"></div>
            <div className="space-y-4 mb-2">
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-white hover:text-blue-500 hover:shadow-lg hover:scale-105 hover:outline hover:outline-blue-500 transition duration-300 flex justify-center space-x-2 items-center"
                onClick={handleGetAddresses}
              >
                <IoCube />
                <p>Address</p>
              </button>
              <div className="flex justify-start items-center space-x-2">
                <PiPolygonDuotone className="text-xl" />
                <p>Current Polygon:</p>
              </div>
              <p className="text-gray-400">
                {currentPolygon
                  ? JSON.stringify(currentPolygon.getLatLngs())
                  : "No polygon created yet."}
              </p>
            </div>
            <div className="flex flex-wrap w-full">
              {loadingAddressesInfo && (
                <p className="text-gray-400">
                  Loading addresses informations...
                </p>
              )}
              {addressesMapBox && addressesOSM && (
                <Card mapbox={addressesMapBox} osm={addressesOSM} />
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
