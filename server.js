import express from 'express';
import { createServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SONGS_FILE = path.join(__dirname, 'src', 'data', 'songs.json');

const app = express();
app.use(express.json());

// API endpoints
app.get('/api/songs', async (req, res) => {
  try {
    const data = await fs.readFile(SONGS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading songs file:', error);
    res.status(500).json({ error: 'Failed to read songs' });
  }
});

app.post('/api/songs', async (req, res) => {
  try {
    const { songs } = req.body;
    const data = {
      songs,
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      metadata: {
        description: "Gungun Music App Song Database",
        format: "JSON",
        encoding: "UTF-8"
      }
    };
    await fs.writeFile(SONGS_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing songs file:', error);
    res.status(500).json({ error: 'Failed to save songs' });
  }
});

// Create Vite server in middleware mode
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

const port = 5173;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});