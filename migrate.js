import { 
  initializeDatabase,
  getAllPlayers,
  getAllEventDefinitions,
  createPlayer,
  createEventDefinition
} from './db.js';
import { LIFE_EVENTS } from './constants.js';

const INITIAL_PLAYERS = [
  {
    id: 'p1',
    name: 'Shannon',
    score: 0,
    members: [],
  },
  {
    id: 'p2',
    name: 'Sam',
    score: 0,
    members: [],
  },
];

async function migrate() {
  console.log('🚀 Starting database migration...');
  
  try {
    // Initialize database tables
    await initializeDatabase();
    console.log('✅ Database tables initialized');

    // Check if we need to seed data
    const existingPlayers = await getAllPlayers();
    const existingEvents = await getAllEventDefinitions();

    if (existingPlayers.length === 0) {
      console.log('📝 Seeding initial players...');
      for (const player of INITIAL_PLAYERS) {
        await createPlayer(player);
        console.log(`   Added player: ${player.name}`);
      }
    } else {
      console.log(`✅ Found ${existingPlayers.length} existing players`);
    }

    if (existingEvents.length === 0) {
      console.log('📝 Seeding initial life events...');
      for (const event of LIFE_EVENTS) {
        await createEventDefinition(event);
        console.log(`   Added event: ${event.name} (${event.points} points)`);
      }
    } else {
      console.log(`✅ Found ${existingEvents.length} existing life events`);
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate();
}

export default migrate;