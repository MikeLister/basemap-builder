#!/bin/bash

SRC_GPKG="OS_Open_Zoomstack.gpkg"
CLIP_GPKG="England.gpkg"
CLIP_LAYER="CTRY_DEC_2024_UK_BFC"

OUT_DIR="clipped_layers"
mkdir -p "$OUT_DIR"

# Max number of parallel jobs
MAX_JOBS=6

clip_layer() {
  LAYER=$1
  echo "Processing $LAYER..."
  ogr2ogr \
    -f GPKG "${OUT_DIR}/${LAYER}.gpkg" \
    -nln "${LAYER}" \
    -clipsrc "$CLIP_GPKG" \
    -clipsrcsql "SELECT * FROM $CLIP_LAYER WHERE CTRY24NM = 'England'" \
    "$SRC_GPKG" "$LAYER"
  echo "✅ Finished $LAYER"
}

export -f clip_layer
export SRC_GPKG CLIP_GPKG CLIP_LAYER OUT_DIR

# Run parallel using xargs
cat layers.txt | xargs -P "$MAX_JOBS" -n 1 -I {} bash -c 'clip_layer "$@"' _ {}