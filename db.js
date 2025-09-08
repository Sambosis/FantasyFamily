import pkg from 'pg';
const { Pool } = pkg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create family_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS family_members (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        player_id VARCHAR(255) REFERENCES players(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create event_definitions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS event_definitions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        points INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create logged_events table
    await client.query(`
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
  } finally {
    client.release();
  }
}

// Database query functions
export async function getAllPlayers() {
  const client = await pool.connect();
  try {
    const playersResult = await client.query('SELECT * FROM players ORDER BY score DESC');
    const membersResult = await client.query('SELECT * FROM family_members');
    
    const players = playersResult.rows.map(player => ({
      ...player,
      members: membersResult.rows.filter(member => member.player_id === player.id)
    }));
    
    return players;
  } finally {
    client.release();
  }
}

export async function createPlayer(player) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO players (id, name, score) VALUES ($1, $2, $3)',
      [player.id, player.name, player.score]
    );
    return player;
  } finally {
    client.release();
  }
}

export async function updatePlayer(playerId, updates) {
  const client = await pool.connect();
  try {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [playerId, ...Object.values(updates)];
    
    await client.query(
      `UPDATE players SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      values
    );
    
    return true;
  } finally {
    client.release();
  }
}

export async function deletePlayer(playerId) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM players WHERE id = $1', [playerId]);
    return true;
  } finally {
    client.release();
  }
}

export async function createFamilyMember(member) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO family_members (id, name, player_id) VALUES ($1, $2, $3)',
      [member.id, member.name, member.player_id]
    );
    return member;
  } finally {
    client.release();
  }
}

export async function updateFamilyMemberPlayer(memberId, newPlayerId) {
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE family_members SET player_id = $1 WHERE id = $2',
      [newPlayerId, memberId]
    );
    return true;
  } finally {
    client.release();
  }
}

export async function getAllEventDefinitions() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM event_definitions ORDER BY created_at');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createEventDefinition(event) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO event_definitions (id, name, points, category) VALUES ($1, $2, $3, $4)',
      [event.id, event.name, event.points, event.category]
    );
    return event;
  } finally {
    client.release();
  }
}

export async function getAllLoggedEvents() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM logged_events ORDER BY timestamp DESC');
    return result.rows.map(event => ({
      ...event,
      timestamp: new Date(event.timestamp)
    }));
  } finally {
    client.release();
  }
}

export async function createLoggedEvent(event) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO logged_events (id, member_name, player_name, event_name, points, category, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [event.id, event.member_name, event.player_name, event.event_name, event.points, event.category, event.timestamp]
    );
    return event;
  } finally {
    client.release();
  }
}

export default pool;