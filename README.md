


<p align="center">
    <a href="https://github.com/lucaimbalzano/difference.between.mapbox-openstreetmap" target="blank"><img src="https://static.vecteezy.com/system/resources/previews/006/957/411/large_2x/geo-letter-logo-design-on-white-background-geo-creative-initials-letter-logo-concept-geo-letter-design-vector.jpg" width="200" alt="Geo Logo" /></a>
</p>
<h1 align="center"> difference.between.mapbox-openstreetmap</h1>
<p align="center">Difference between openstreetmap and mapbox: input geometry (Geojson format) get addresses.</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge" alt="JavaScript Badge">
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge" alt="Express.js Badge">
<img src="https://img.shields.io/badge/TypeORM-FF5733?logo=typeorm&logoColor=white&style=for-the-badge" alt="TypeORM Badge">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge" alt="TypeScript Badge">
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge" alt="PostgreSQL Badge">
</p>

## 💠 Preview 
![polys](https://github.com/user-attachments/assets/3bf63006-ac77-4b94-b3d2-545b59b53ab1)
`
⚠ (I don't know yet why it doesn't display all geoJson points on polygons vertex, by the way i logged them in order ti make you understand)
`
## 💠 Installation

First, clone the repository:

```bash
$ git clone https://github.com/lucaimbalzano/difference.between.mapbox-openstreetmap
```


The frontend is in [leaflet-viewer/](./leaflet-viewer/)
- i used nextjs

The backend is in [polygon-to-address/](./polygon-to-address/)
- i used expressjs and typeorm 
```
$ cd leaflet-viewer || cd polygon-to-address
$ npm install
```

as database a used postgresSQL

## 💠 Running the app

```bash
## leaflet-viewer
# development
$ npm run dev-p

## polygon-to-address
# development
$ npm run dev-babel

```

## 💠 Documentation and Analysis

You can find several [queries utilities here](./polygon-to-address/src/utils/queries.sql)


OSM Database
```bash
## Showing all rows address i have in italy
SELECT
  COUNT(*) AS all_addresses_retrieved,
  COUNT(DISTINCT o.name) AS distinct_names_count
FROM
  overpass o;

Result:
all_addresses_retrieved|region_count|
-----------------------+------------+
                1910222|          20|
```

```bash
## Showing all addresses per region in italy
 SELECT
  o."location",
  COUNT(DISTINCT o."name") AS name_count_per_location
FROM
  overpass o
GROUP BY
  o."location";

Result:
location             |name_count_per_location|
---------------------+-----------------------+
Abruzzo              |                  13782|
Basilicata           |                   5358|
Calabria             |                  12227|
Campania             |                  25443|
Emilia-Romagna       |                  39982|
Friuli Venezia Giulia|                  14506|
Lazio                |                  37633|
Liguria              |                  14603|
Lombardia            |                  53427|
Marche               |                  12255|
Molise               |                   3182|
Piemonte             |                  34868|
Puglia               |                  31750|
Sardegna             |                  16478|
Sicilia              |                  42324|
Toscana              |                  26120|
Trentino-Alto Adige  |                  21079|
Umbria               |                  10407|
Valle d Aosta        |                   2260|
Veneto               |                  39997|
```



## 💠 Osmanames utility

```bash
# this is usefull to get OSM_ID of areas:

## if you have a macos, you should specify the platform you want to use because of the image on docker-hub OS/ARCH -> linux/amd64 

$ docker run --platform linux/amd64 -d -p 80:80 klokantech/osmnames-sphinxsearch

```

## 💠 License

Make with 💔 by Luca Imbalzano
<br> [MIT licensed](LICENSE).
