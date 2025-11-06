const fs = require('fs');
const { chain } = require('stream-chain');
const { parser } = require('stream-json');
const { pick } = require('stream-json/filters/Pick');
const { streamArray } = require('stream-json/streamers/StreamArray');

const inputFile = 'geojson_layers/roads_national.geojson';

const allTypes = new Set();
const counts = {};

const pipeline = chain([
  fs.createReadStream(inputFile),
  parser(),
  pick({ filter: 'features' }),
  streamArray()
]);

pipeline.on('data', ({ value }) => {
  const t = value.properties.type || '(missing)';
  allTypes.add(t);
  counts[t] = (counts[t] || 0) + 1;
});

pipeline.on('end', () => {
  console.log(`✅ Found ${allTypes.size} unique 'type' values:\n`);
  for (const t of allTypes) {
    console.log(`${t}: ${counts[t]}`);
  }
});

pipeline.on('error', (err) => {
  console.error('❌ Error while streaming:', err);
});
