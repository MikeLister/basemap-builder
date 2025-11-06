const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8000;

const TILE_DIR = path.join(__dirname, 'base-tiles');

app.use(cors());

// --- Serve vector tiles ---
app.get('/:z/:x/:y.pbf', (req, res) => {
  const { z, x, y } = req.params;
  const tilePath = path.join(TILE_DIR, z, x, `${y}.pbf`);

  if (!fs.existsSync(tilePath)) {
    return res.status(404).send('Tile not found');
  }

  res.setHeader('Content-Type', 'application/x-protobuf');
  res.setHeader('Content-Encoding', 'gzip');
  fs.createReadStream(tilePath).pipe(res);
});


// --- Optional: Serve static files (e.g., styles, html, etc.) ---
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Tiles: http://localhost:${PORT}/{z}/{x}/{y}.pbf`);
});
