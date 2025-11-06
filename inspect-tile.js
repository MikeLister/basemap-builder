const fs = require('fs');
const zlib = require('zlib');
const Pbf = require('pbf').default || require('pbf');
const { VectorTile } = require('@mapbox/vector-tile');

const tilePath = './base-tiles/9/249/170.pbf';

const data = fs.readFileSync(tilePath);

let buffer = data;
try {
  buffer = zlib.gunzipSync(data);
  console.log('✅ Decompressed gzip successfully');
} catch (e) {
  console.log('ℹ️ Not gzipped or already decompressed');
}

try {
  const tile = new VectorTile(new Pbf(buffer));
  const layers = Object.keys(tile.layers);
  console.log('📚 Layers found:', layers);

  for (const l of layers) {
    const layer = tile.layers[l];
    console.log(`- ${l}: ${layer.length} features`);
    if (layer.length > 0) {
      const feature = layer.feature(0).toGeoJSON(10, 10, 5);
      console.log('  Example feature properties:', feature.properties);
    }
  }
} catch (err) {
  console.error('❌ Failed to parse as vector tile:', err.message);
}
