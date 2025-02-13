import { topology } from "topojson-server";
import { feature } from "topojson-client";
import { featurecollection } from "../utils/featurecollection.mjs";
import { presimplify, quantile, simplify as simple } from "topojson-simplify";

const topojson = Object.assign(
  {},
  { topology, presimplify, quantile, simple, feature }
);
import { union } from "./union.mjs";

/**
 * Simplify geometries of a GeoJSON FeatureCollection / Array of Features / Array of Geometries
 * using <code>topojson-simplify</code> library.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/simplify?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {array|object} geojson - The GeoJSON FeatureCollection / array of Features / array of Geometries
 * @param {object} options - Optional parameters
 * @param {number} [options.k=0.5] - The quantile of the simplification
 * @returns {{features: {geometry: {}, type: string, properties: {}}[], type: string}}
 *
 * @example
 * geo.simplify(
 *     world,
 *     {
 *         k, // factor of simplification (default: 0.5)
 *     })
 */
export function simplify(geojson, options = {}) {
  let k = options.k ? options.k : 0.5;
  // union or not
  let geo;
  geo = featurecollection(geojson);

  // simplification
  let topo = topojson.topology({ foo: geo });
  let simpl = topojson.presimplify(topo);
  simpl = topojson.simple(simpl, topojson.quantile(simpl, k));
  geo.features = topojson.feature(
    simpl,
    Object.keys(simpl.objects)[0]
  ).features;
  return geo;
}
