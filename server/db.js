import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create players table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create family_members table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS family_members (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        player_id VARCHAR(255) REFERENCES players(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create life_events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS life_events (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        points INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create logged_events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logged_events (
        id VARCHAR(255) PRIMARY KEY,
        member_name VARCHAR(255) NOT NULL,
        player_name VARCHAR(255) NOT NULL,
        event_name VARCHAR(255) NOT NULL,
        points INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Player operations
export async function getPlayers() {
  try {
    const playersResult = await pool.query('SELECT * FROM players ORDER BY score DESC');
    const players = playersResult.rows;

    // Get family members for each player
    for (const player of players) {
      const membersResult = await pool.query(
        'SELECT id, name FROM family_members WHERE player_id = $1',
        [player.id]
      );
      player.members = membersResult.rows;
    }

    return players;
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
}

export async function createPlayer(player) {
  try {
    await pool.query(
      'INSERT INTO players (id, name, score) VALUES ($1, $2, $3)',
      [player.id, player.name, player.score || 0]
    );
    return player;
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
}

export async function updatePlayer(id, updates) {
  try {
    const { name, score } = updates;
    await pool.query(
      'UPDATE players SET name = COALESCE($1, name), score = COALESCE($2, score), updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name, score, id]
    );
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
}

export async function deletePlayer(id) {
  try {
    await pool.query('DELETE FROM players WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
}

// Family member operations
export async function createFamilyMember(member, playerId) {
  try {
    await pool.query(
      'INSERT INTO family_members (id, name, player_id) VALUES ($1, $2, $3)',
      [member.id, member.name, playerId]
    );
    return member;
  } catch (error) {
    console.error('Error creating family member:', error);
    throw error;
  }
}

export async function tradeFamilyMember(memberId, fromPlayerId, toPlayerId) {
  try {
    await pool.query(
      'UPDATE family_members SET player_id = $1 WHERE id = $2',
      [toPlayerId, memberId]
    );
  } catch (error) {
    console.error('Error trading family member:', error);
    throw error;
  }
}

// Life events operations
export async function getLifeEvents() {
  try {
    const result = await pool.query('SELECT * FROM life_events ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error getting life events:', error);
    throw error;
  }
}

export async function createLifeEvent(event) {
  try {
    await pool.query(
      'INSERT INTO life_events (id, name, points, category) VALUES ($1, $2, $3, $4)',
      [event.id, event.name, event.points, event.category]
    );
    return event;
  } catch (error) {
    console.error('Error creating life event:', error);
    throw error;
  }
}

// Logged events operations
export async function getLoggedEvents() {
  try {
    const result = await pool.query('SELECT * FROM logged_events ORDER BY timestamp DESC');
    return result.rows;
  } catch (error) {
    console.error('Error getting logged events:', error);
    throw error;
  }
}

export async function createLoggedEvent(event) {
  try {
    await pool.query(
      'INSERT INTO logged_events (id, member_name, player_name, event_name, points, category, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [event.id, event.memberName, event.playerName, event.eventName, event.points, event.category, event.timestamp]
    );
    return event;
  } catch (error) {
    console.error('Error creating logged event:', error);
    throw error;
  }
}

// Get all data (for initial load)
export async function getAllData() {
  try {
    const [players, lifeEvents, loggedEvents] = await Promise.all([
      getPlayers(),
      getLifeEvents(),
      getLoggedEvents()
    ]);

    return {
      players,
      lifeEvents,
      loggedEvents
    };
  } catch (error) {
    console.error('Error getting all data:', error);
    throw error;
  }
}

// Seed initial data if database is empty
export async function seedInitialData() {
  try {
    const playersResult = await pool.query('SELECT COUNT(*) FROM players');
    const playersCount = parseInt(playersResult.rows[0].count);

    if (playersCount === 0) {
      // Import initial data from constants
      const { LIFE_EVENTS } = await import('../constants.js');
      
      // Create initial players
      const initialPlayers = [
        { id: 'p1', name: 'Shannon', score: 0 },
        { id: 'p2', name: 'Sam', score: 0 }
      ];

      for (const player of initialPlayers) {
        await createPlayer(player);
      }

      // Create initial life events
      for (const event of LIFE_EVENTS) {
        await createLifeEvent(event);
      }

      console.log('Initial data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}

export default pool;