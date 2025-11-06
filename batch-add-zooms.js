// batch_add_zooms_from_lookup.js
const fs = require('fs');
const path = require('path');
const { chain } = require('stream-chain');
const { parser } = require('stream-json');
const { pick } = require('stream-json/filters/Pick');
const { streamArray } = require('stream-json/streamers/StreamArray');

const inputDir = 'geojson_layers';
const outputDir = 'geojson_layers_with_zooms';
const zoomMappingFile = 'zoom_mapping.json';

// Load mapping lookup
const zoomMappings = JSON.parse(fs.readFileSync(zoomMappingFile, 'utf8'));

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

// --- Helper: process a single GeoJSON file ---
function processFile(inputPath, outputPath, mappingForFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const fileName = path.basename(inputPath, '.geojson');

    output.write(
      `{"type":"FeatureCollection","name":"${fileName}","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"features":[`
    );

    let first = true;
    let count = 0;
    let missing = 0;

    const mappingKeys = Object.keys(mappingForFile || {});
    const onlyOneEntry = mappingKeys.length === 1;
    const singleValue = onlyOneEntry ? mappingForFile[mappingKeys[0]] : null;

    const pipeline = chain([
      fs.createReadStream(inputPath),
      parser(),
      pick({ filter: 'features' }),
      streamArray()
    ]);

    pipeline.on('data', ({ value }) => {
      const t = value.properties?.type;
      value.tippecanoe = {};

      if (onlyOneEntry) {
        // Use the single [min,max] value for all features
        [value.tippecanoe.minzoom, value.tippecanoe.maxzoom] = singleValue;
      } else if (t && mappingForFile[t]) {
        // Use type-based mapping
        [value.tippecanoe.minzoom, value.tippecanoe.maxzoom] = mappingForFile[t];
      } else {
        // Default fallback if no match
        value.tippecanoe.minzoom = 10;
        value.tippecanoe.maxzoom = 14;
        missing++;
      }

      if (!first) output.write(',');
      first = false;
      output.write(JSON.stringify(value));
      count++;
    });

    pipeline.on('end', () => {
      output.write(']}');
      output.end();
      console.log(`✅ ${fileName}: ${count} features processed`);
      if (missing)
        console.log(`⚠️  ${missing} features had unrecognised type values`);
      resolve();
    });

    pipeline.on('error', (err) => {
      console.error(`❌ Error processing ${inputPath}:`, err);
      reject(err);
    });
  });
}

// --- Run the batch job ---
(async () => {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.geojson'));

  console.log(`📂 Found ${files.length} GeoJSON file(s) in ${inputDir}`);

  for (const file of files) {
    const fileName = path.basename(file, '.geojson');
    const mappingForFile = zoomMappings[fileName];

    if (!mappingForFile) {
      console.log(`⚠️  No zoom mapping found for ${fileName}, skipping.`);
      continue;
    }

    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    await processFile(inputPath, outputPath, mappingForFile);
  }

  console.log('\n🎉 All files processed!');
})();
