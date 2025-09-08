# Fantasy Family

A fun family competition tracker where players draft family members and score points based on life events. Now with persistent storage and real-time synchronization across all devices!

## Features

- **Player Management**: Add and manage players who compete in the league
- **Family Member Draft**: Each player can draft family members to their team
- **Event Tracking**: Log life events (promotions, new jobs, birthdays, etc.) that earn or lose points
- **Live Leaderboard**: Real-time scoring and rankings
- **Commissioner Mode**: Special admin view for managing the league
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Persistent Storage**: All data is stored in PostgreSQL database and synced across all devices
- **Real-time Updates**: Changes made by any user are instantly reflected for all other users
- **Cross-Device Sync**: Access the same data from any computer or device

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- PostgreSQL for persistent data storage
- Express.js for REST API
- Socket.io for real-time synchronization
- Heroku for deployment

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update the DATABASE_URL with your local PostgreSQL connection string.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment to Heroku

This application is configured to deploy to Heroku with PostgreSQL database support.

### Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku app created

### Deployment Steps

1. Create a new Heroku app (if not already created):
   ```bash
   heroku create your-app-name
   ```

2. Add PostgreSQL database:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. Deploy to Heroku:
   ```bash
   git add .
   git commit -m "Add persistent database storage"
   git push heroku main
   ```

4. Open your app:
   ```bash
   heroku open
   ```

### Environment Variables

The following environment variables are automatically set by Heroku:

- `DATABASE_URL`: PostgreSQL connection string (set by Heroku Postgres addon)
- `PORT`: Port number for the web server
- `NODE_ENV`: Set to "production" on Heroku

### Build Process

The application uses the following build process on Heroku:

1. `heroku-postbuild` script runs `npm run build` to create the production build
2. Database tables are automatically initialized on first run
3. The `start` script serves the built application using Express with Socket.io
4. Static files are served from the `dist` directory
5. All routes are handled by the React application for client-side routing

## Project Structure

- `src/` - React components and frontend code
- `server/` - Backend API and database modules
  - `db.js` - Database connection and operations
  - `api.js` - REST API endpoints
- `api/` - Frontend API client
  - `client.ts` - API client with Socket.io integration
- `dist/` - Production build output (created during build)
- `server.js` - Express server with Socket.io for real-time updates
- `vite.config.ts` - Vite configuration
- `Procfile` - Heroku process configuration
- `.env.example` - Environment variables template

## How It Works

1. **Data Persistence**: All game data (players, family members, events) is stored in a PostgreSQL database
2. **API Communication**: Frontend communicates with backend through REST API endpoints
3. **Real-time Sync**: Socket.io broadcasts changes to all connected clients
4. **Automatic Updates**: When one user makes a change, all other users see it immediately
5. **Error Handling**: Graceful fallbacks if database connection fails

## Database Schema

- `players` - Stores player information and scores
- `family_members` - Stores family members assigned to players
- `life_events` - Stores available event definitions
- `logged_events` - Stores historical event logs

## Troubleshooting

If data isn't persisting:
1. Check database connection: `heroku logs --tail`
2. Verify PostgreSQL addon: `heroku addons`
3. Check DATABASE_URL: `heroku config`
4. View database tables: `heroku pg:psql` then `\dt`

For more detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)