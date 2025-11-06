# basemap-builder
Creating a custom vector tiles basemap for web mapping from OS Open Zoomstack 

## 1. Get OS Open Zoomstack
Go to [the OS Data Hub](https://osdatahub.os.uk/data/downloads/open/OpenZoomstack) and download the GeoPackage version of OS Open Zoomstack

## 2. Make a list of layers that you want to include
In layers.txt make a list of the layers that you want to include in the final basemap. You can get the available layers from the [OS GeoPackage schema](https://docs.os.uk/os-downloads/contextual-or-derived-mapping/os-open-zoomstack/os-open-zoomstack-technical-specification/geopackage-schema). Take time at this stage to get this right, as each layer takes a long time to process.

## 3. Get the England boundary GeoPackage file
We want to reduce the extent of the basemap to only include areas within England. Go to the [GeoPortal](https://geoportal.statistics.gov.uk/), and select Boundaries > Administrative Boundaries > Countries > 2024 Boundaries. Use the filters to select only England, and download the GeoPackage files (make sure that the filters are included in the download.)

## 4. Clip the layers to England and output to single files in a directory
We will use the `clip_parallel.sh` file to clip the selected layers to just the features that fit within the England boundary. Check that the file names match those in that file, and that they are in the same directory as that file. To make the file executable run `chmod +x clip_parallel.sh` from within the termainal. Then run it with `./clip_parallel.sh`.

Depending on the layers that you have selected this could take **several days**. Make sure that your computer doesn't go to sleep by adjusting your battery settings or by running `caffeinate -i` in another terminal - remember to terminate this when the process is finished.

## 5. Re-project each .gpkg file to Web Mercator and convert to GeoJSON at the same time
The OS Open Zoomstack GeoPackage is in British National Grid projection, but for most web mapping packages we need to projection to be Web Mercator, so we need to re-project the coordinates. For the next stages of the process we also would prefer the files to be GeoJSON, so we'll make that conversion at the same time using `convert_gpkg.sh`. To make the file executable run `chmod +x convert_gpkg.sh` from within the termainal. Then run it with `./convert_gpkg.sh`.