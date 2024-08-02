import React from "react";
import { FaMapLocationDot } from "react-icons/fa6";

export default function Card({ mapbox, osm, indirizzi_osm_found }: any) {
  let counterOsm = 0;
  let counterMb = 0;

  // Sort the addresses by route, handling undefined routes
  const sortedMapboxAddresses = mapbox?.indirizzi
    ? [...mapbox.indirizzi].sort((a: any, b: any) => {
        const routeA = a.route || ""; // Fallback to an empty string if route is undefined
        const routeB = b.route || ""; // Fallback to an empty string if route is undefined
        return routeA.localeCompare(routeB);
      })
    : [];

  const sortedOsmAddresses = osm?.indirizzi_osm?.list_address
    ? [...osm.indirizzi_osm.list_address].sort((a: any, b: any) => {
        const routeA = a.name || ""; // Fallback to an empty string if name is undefined
        const routeB = b.name || "";
        return routeA.localeCompare(routeB);
      })
    : Array.isArray(osm)
    ? [...osm].sort((a: any, b: any) => {
        const routeA = a.via || ""; // Fallback to an empty string if via is undefined
        const routeB = b.via || "";
        return routeA.localeCompare(routeB);
      })
    : [];

  return (
    <div className="relative w-full flex flex-col justify-start overflow-hidden py-6 sm:py-12">
      <div className="group relative cursor-pointer overflow-hidden bg-slate-200 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-lg sm:px-10">
        <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-sky-500 transition-all duration-300 group-hover:scale-[100]"></span>
        <div className="relative z-10 mx-auto">
          <div className="flex space-x-10 mb-5">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-sky-500 transition-all duration-300 group-hover:bg-sky-400">
              <FaMapLocationDot className="text-3xl" />
            </span>
            <div className="flex items-center">
              <div className="items-center justify-center text-xl text-sky-500 uppercase">
                {osm && osm?.indirizzi_osm?.list_address[0].location
                  ? osm?.indirizzi_osm?.list_address[0].location
                  : osm[0].ufficio}{" "}
                - {mapbox && mapbox.indirizzi[0].comune}
                {indirizzi_osm_found ? (
                  <p>Indirizzi trovati: {indirizzi_osm_found}</p>
                ) : (
                  <p>
                    {mapbox &&
                      mapbox.indirizzi &&
                      mapbox.indirizzi[0] &&
                      mapbox.indirizzi[0].provincia}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full">
            {mapbox && (
              <div className="w-full space-y-3 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                <p className="font-mono font-bold">MapBox indirizzi</p>

                {sortedMapboxAddresses.map((address: any, indexMb: number) => {
                  if (address.message === undefined) {
                    counterMb++;
                    return (
                      <div key={indexMb}>
                        <p>
                          [{counterMb}]route: {address.route}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
            <div className="w-full space-y-3 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
              <p className="font-mono font-bold">Osm indirizzi</p>
              {osm &&
                sortedOsmAddresses.map((address: any, indexOsm: number) => {
                  if (address.message === undefined) {
                    counterOsm++;
                    return (
                      <div key={indexOsm}>
                        <p>
                          [{counterOsm}]route:{" "}
                          {address.name == undefined
                            ? address.via
                            : address.name}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
