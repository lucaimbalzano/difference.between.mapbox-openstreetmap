const addressesTest = {
  indirizzi_found: 10,
  indirizzi: [
    {
      route: "Viale Monte Nero",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.3513365090062088",
    },
    {
      route: "Via Pier Lombardo",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.816902654850280",
    },
    {
      route: "Via Carlo Botta",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.3470168720339614",
    },
    {
      route: "Via Plauto",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.5215383701134012",
    },
    {
      route: "Viale Lazio",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.5409436000153038",
    },
    {
      route: "Via Giorgio Vasari",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.8248948107365438",
    },
    {
      route: "Via Serviliano Lattuada",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.4972336266804948",
    },
    {
      lat: 45.453958799812675,
      lng: 9.204587424502835,
      message: "No address found",
    },
    {
      lat: 45.45456307254672,
      lng: 9.205015679989268,
      message: "No address found",
    },
    {
      route: "Largo Franco Parenti",
      comune: "Milano",
      provincia: "MI",
      placeId: "address.4662328126930764",
    },
  ],
};

const addressOsmTest = {
  indirizzi_found: 5,
  indirizzi_osm: {
    list_address: [
      { name: "Largo Franco Parenti" },
      { name: "Via Carlo Botta" },
      { name: "Via Giorgio Vasari" },
      { name: "Via Pier Lombardo" },
      { name: "Via Sabina" },
    ],
    list_geomtries: [
      {
        geom: {
          type: "LineString",
          coordinates: [
            [9.2059176, 45.4536165],
            [9.2060853, 45.4535517],
          ],
        },
      },
      {
        geom: {
          type: "LineString",
          coordinates: [
            [9.2063936, 45.4557089],
            [9.2063609, 45.455672],
            [9.2055537, 45.4546808],
            [9.205536, 45.4546591],
            [9.2055011, 45.4546163],
          ],
        },
      },
      {
        geom: {
          type: "LineString",
          coordinates: [
            [9.2066074, 45.4533539],
            [9.2070733, 45.4539179],
            [9.2071207, 45.4539754],
          ],
        },
      },
      {
        geom: {
          type: "LineString",
          coordinates: [
            [9.2043348, 45.4550885],
            [9.2044422, 45.4550444],
            [9.2054085, 45.4546532],
            [9.2055011, 45.4546163],
          ],
        },
      },
      {
        geom: {
          type: "LineString",
          coordinates: [
            [9.2060853, 45.4535517],
            [9.2065043, 45.4533927],
            [9.2065564, 45.4533729],
            [9.2066074, 45.4533539],
          ],
        },
      },
    ],
  },
};
