# basemap-builder
Creating a custom vector tiles basemap for web mapping from OS Open Zoomstack 

## 1. Get OS Open Zoomstack
Go to [the OS Data Hub](https://osdatahub.os.uk/data/downloads/open/OpenZoomstack) and download the GeoPackage version of OS Open Zoomstack

## 2. Make a list of layers that you want to include
In layers.txt make a list of the layers that you want to include in the final basemap. You can get the available layers from the [OS GeoPackage schema](https://docs.os.uk/os-downloads/contextual-or-derived-mapping/os-open-zoomstack/os-open-zoomstack-technical-specification/geopackage-schema). Take time at this stage to get this right, as each layer takes a long time to process.

## 3. Get the England boundary GeoPackage file
We want to reduce the extent of the basemap to only include areas within England. Go to the [GeoPortal](https://geoportal.statistics.gov.uk/), and select Boundaries > Administrative Boundaries > Countries > 2024 Boundaries. Use the filters to select only England, and download the GeoPackage files (make sure that the filters are included in the download.)

## 4. Clip the layers to England and output to single files in a directory
