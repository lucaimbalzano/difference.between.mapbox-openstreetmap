DELETE FROM overpass
WHERE location = 'Aosta'
   OR location LIKE '%Lombardia%'

  
  
[out:json];
area(3600053937)->.searchArea;
(
  way["highway"]["name"](area.searchArea);
);
out body;
>;
out skel qt;


 INSERT INTO "overpass" ("location", "geom", "idOsm", "type_location", "lanes", "name", "old_ref", "surface", "type")
            VALUES (
                    'Valle d''Aosta', 
                    ST_SetSRID(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[6.862873,45.9008595],[6.8631281,45.9007115],[6.8633178,45.9005863],[6.8634927,45.900445],[6.8758284,45.8890545],[6.8759653,45.8889395],[6.8781998,45.8870627],[6.8788058,45.8864972],[6.8794427,45.8859028],[6.9003478,45.8663891],[6.9042318,45.8627629],[6.9084213,45.8588512],[6.9108266,45.8566052],[6.9125622,45.8549846],[6.9220039,45.8461673]]}'), 4326), 
                    'way/4525912', 
                    'trunk', 
                    '2', 
                    'Tunnel du Mont Blanc', 
                    'undefined', 
                    'asphalt', 
                    'Feature'
                  )
                  
  
                  select count(*) from overpass o
                  SELECT COUNT(DISTINCT location) AS distinct_location_count FROM overpass;
                 SELECT COUNT(DISTINCT location) AS distinct_location_count, count(*) as num_rows FROM overpass;
				  SELECT DISTINCT location AS distinct_locations FROM overpass;
                  select * from overpass o where o.location = 'Liguria'
                  select count(*) from overpass o where o.location = 'Liguria'


select count(*) from overpass o where o."location" = 'Veneto'

DROP FUNCTION get_intersecting_lines(geometry)


CREATE OR REPLACE FUNCTION get_intersecting_lines(polygon_input GEOMETRY)
RETURNS TABLE (
    id INT,
    location VARCHAR,
    geom GEOMETRY,
    type_location VARCHAR,
    name VARCHAR,
    surface VARCHAR,
    type VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (overpass.name)
        overpass.id,
        overpass.location,
        overpass.geom,
        overpass.type_location,
        overpass.name,
        overpass.surface,
        overpass.type
    FROM public.overpass
    WHERE ST_Intersects(overpass.geom, polygon_input)
    ORDER BY overpass.name, overpass.id;
END;
$$ LANGUAGE plpgsql;


-- Define the input polygon
WITH polygon_input AS (
    SELECT ST_GeomFromText('POLYGON((9.554885 45.667864, 9.554134 45.665583, 9.556044 45.664173, 9.557975 45.664173, 9.559005 45.666469, 9.554885 45.667864))', 4326) AS geom
)

-- Call the function
SELECT *
FROM get_intersecting_lines((SELECT geom FROM polygon_input));




SELECT DISTINCT ON ("overpass"."name") 
    "overpass"."id" AS "overpass_id",
    "overpass"."location" AS "overpass_location", 
    "overpass"."geom" AS "overpass_geom", 
    "overpass"."type_location" AS "overpass_type_location",
    "overpass"."name" AS "overpass_name", 
    "overpass"."surface" AS "overpass_surface", 
    "overpass"."type" AS "overpass_type" 
FROM "overpass" "overpass" 
WHERE ST_Intersects("overpass"."geom", ST_GeomFromText($1, 4326)) 
ORDER BY "overpass"."name" ASC, "overpass"."id" ASC;



SELECT 
  (SELECT COUNT(*) FROM "overpass-api".public.comune) AS count_comuni, 
  (SELECT COUNT(*) FROM perimeters) AS count_perimeters;


select * from comune c where comune = 'Venezia'

select distinct type from perimeters p 
select * from perimeters p where type = 'Regione'
select * from perimeters p where type = 'Comune'
select * from perimeters p where type = 'Zona'

select distinct regione from comune c 

SELECT
(select count(*) from overpass o where "comuneId" is not null) as comuneid_not_null,
(select count(*) from overpass o where "comuneId" is null) as comuneid_is_null;


select * from overpass o where "comuneId" is null


select distinct location from overpass o order by "location"
select distinct regione from comune order by regione

select distinct "location"  from overpass o where "comuneId" is null order by "location"
	select count(*) from overpass o2 where "comuneId" is null and "location" = 'Calabria'
