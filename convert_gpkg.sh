#!/bin/bash

# Set input and output directories
INPUT_DIR="./clipped_layers"
OUTPUT_DIR="./geojson_layers"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all .gpkg files in the input directory
for file in "$INPUT_DIR"/*.gpkg; do
  # Get the base filename without extension
  filename=$(basename "$file" .gpkg)

  # Run ogr2ogr to convert and reproject
  ogr2ogr -f GeoJSON "$OUTPUT_DIR/$filename.geojson" "$file" -t_srs EPSG:4326
done
