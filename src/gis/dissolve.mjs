import { geoArea } from "d3-geo";
import { featurecollection } from "../utils/featurecollection.mjs";

/**
 * Dissolve multipart geometries to single part geometries.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/dissolve?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param geojson - The target GeoJSON FeatureCollection / array of Features / array of Geometries
 * @returns {{features: {geometry: {}, type: string, properties: {}}[], type: string}} - The resulting GeoJSON FeatureCollection
 *
 */
export function dissolve(geojson) {
  geojson = featurecollection(geojson);
  let result = [];
  geojson.features.forEach((d) => {
    result.push(sp(d));
  });

  const keys = Object.keys(geojson).filter((e) => e != "features");
  const obj = {};
  keys.forEach((d) => {
    obj[d] = geojson[d];
  });
  obj.features = result.flat();

  return obj;
}

function sp(feature) {
  let result = [];

  if (feature.geometry.type.includes("Multi")) {
    feature.geometry.coordinates.forEach((d) => {
      result.push({
        type: "Feature",
        properties: feature.properties,
        geometry: {
          type: feature.geometry.type.replace("Multi", ""),
          coordinates: d,
        },
      });
    });
  } else {
    result.push({ ...feature });
  }

  const totalArea = geoArea(feature);
  result.forEach((d) => (d.__share = geoArea(d) / totalArea));

  return JSON.parse(JSON.stringify(result));
}
