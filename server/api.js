import express from 'express';
import * as db from './db.js';

const router = express.Router();

// Get all data
router.get('/data', async (req, res) => {
  try {
    const data = await db.getAllData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Player endpoints
router.get('/players', async (req, res) => {
  try {
    const players = await db.getPlayers();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

router.post('/players', async (req, res) => {
  try {
    const player = await db.createPlayer(req.body);
    res.json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

router.put('/players/:id', async (req, res) => {
  try {
    await db.updatePlayer(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

router.delete('/players/:id', async (req, res) => {
  try {
    await db.deletePlayer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

// Family member endpoints
router.post('/players/:playerId/members', async (req, res) => {
  try {
    const member = await db.createFamilyMember(req.body, req.params.playerId);
    res.json(member);
  } catch (error) {
    console.error('Error creating family member:', error);
    res.status(500).json({ error: 'Failed to create family member' });
  }
});

router.put('/members/:memberId/trade', async (req, res) => {
  try {
    const { fromPlayerId, toPlayerId } = req.body;
    await db.tradeFamilyMember(req.params.memberId, fromPlayerId, toPlayerId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error trading family member:', error);
    res.status(500).json({ error: 'Failed to trade family member' });
  }
});

// Life events endpoints
router.get('/life-events', async (req, res) => {
  try {
    const events = await db.getLifeEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching life events:', error);
    res.status(500).json({ error: 'Failed to fetch life events' });
  }
});

router.post('/life-events', async (req, res) => {
  try {
    const event = await db.createLifeEvent(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error creating life event:', error);
    res.status(500).json({ error: 'Failed to create life event' });
  }
});

// Logged events endpoints
router.get('/logged-events', async (req, res) => {
  try {
    const events = await db.getLoggedEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching logged events:', error);
    res.status(500).json({ error: 'Failed to fetch logged events' });
  }
});

router.post('/logged-events', async (req, res) => {
  try {
    const event = await db.createLoggedEvent(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error creating logged event:', error);
    res.status(500).json({ error: 'Failed to create logged event' });
  }
});

export default router;