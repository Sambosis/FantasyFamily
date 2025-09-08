import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { 
  initializeDatabase, 
  getAllPlayers, 
  createPlayer, 
  updatePlayer, 
  deletePlayer,
  createFamilyMember,
  updateFamilyMemberPlayer,
  getAllEventDefinitions,
  createEventDefinition,
  getAllLoggedEvents,
  createLoggedEvent
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// API Routes

// Players
app.get('/api/players', async (req, res) => {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

app.post('/api/players', async (req, res) => {
  try {
    const player = await createPlayer(req.body);
    res.json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

app.put('/api/players/:id', async (req, res) => {
  try {
    await updatePlayer(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

app.delete('/api/players/:id', async (req, res) => {
  try {
    await deletePlayer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

// Family Members
app.post('/api/family-members', async (req, res) => {
  try {
    const member = await createFamilyMember(req.body);
    res.json(member);
  } catch (error) {
    console.error('Error creating family member:', error);
    res.status(500).json({ error: 'Failed to create family member' });
  }
});

app.put('/api/family-members/:id/player', async (req, res) => {
  try {
    await updateFamilyMemberPlayer(req.params.id, req.body.player_id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating family member player:', error);
    res.status(500).json({ error: 'Failed to update family member player' });
  }
});

// Event Definitions
app.get('/api/event-definitions', async (req, res) => {
  try {
    const events = await getAllEventDefinitions();
    res.json(events);
  } catch (error) {
    console.error('Error fetching event definitions:', error);
    res.status(500).json({ error: 'Failed to fetch event definitions' });
  }
});

app.post('/api/event-definitions', async (req, res) => {
  try {
    const event = await createEventDefinition(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error creating event definition:', error);
    res.status(500).json({ error: 'Failed to create event definition' });
  }
});

// Logged Events
app.get('/api/logged-events', async (req, res) => {
  try {
    const events = await getAllLoggedEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching logged events:', error);
    res.status(500).json({ error: 'Failed to fetch logged events' });
  }
});

app.post('/api/logged-events', async (req, res) => {
  try {
    const event = await createLoggedEvent(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error creating logged event:', error);
    res.status(500).json({ error: 'Failed to create logged event' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});