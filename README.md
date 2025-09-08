# Fantasy Family League

A fun family competition app where you track real-life events of family members and score points based on their achievements, mishaps, and milestones.

## Features

- **Persistent Data**: All data is stored in a PostgreSQL database, so your family league persists across devices and sessions
- **Real-time Updates**: Changes are immediately saved to the database and visible to all users
- **Commissioner Controls**: Add/remove players, family members, and custom events
- **Event Tracking**: Log life events for family members and automatically update scores
- **Member Trading**: Trade family members between players
- **Leaderboard**: Track who's winning the family competition
- **Responsive Design**: Works on desktop and mobile devices

## Database Migration

The app now uses PostgreSQL for persistent storage instead of localStorage. This means:
- ✅ Data persists across different computers/browsers
- ✅ Multiple people can access the same league simultaneously  
- ✅ No data loss when clearing browser cache
- ✅ Proper backup and recovery options

## Heroku Deployment

### Prerequisites
1. Heroku CLI installed
2. Git repository initialized
3. Heroku app created

### Database Setup
Your Heroku app needs a PostgreSQL database:

```bash
# Add Heroku Postgres addon (this may require payment verification)
heroku addons:create heroku-postgresql:mini -a your-app-name

# Check database URL is set
heroku config -a your-app-name
```

### Deployment Steps
1. **Push to Heroku**:
   ```bash
   git add .
   git commit -m "Add persistent database storage"
   git push heroku main
   ```

2. **Run Database Migration**:
   ```bash
   heroku run npm run migrate -a your-app-name
   ```

3. **Verify Deployment**:
   ```bash
   heroku open -a your-app-name
   ```

### Environment Variables
The app automatically uses `DATABASE_URL` provided by Heroku Postgres. No additional configuration needed.

## Local Development

### Setup
```bash
npm install
```

### Database Setup (Local)
For local development, you'll need PostgreSQL installed:

```bash
# Set database URL for local development
export DATABASE_URL="postgresql://username:password@localhost:5432/fantasy_family"

# Run migration
npm run migrate

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

The app now includes a REST API:

- `GET /api/players` - Get all players with their family members
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player
- `POST /api/family-members` - Add a family member
- `PUT /api/family-members/:id/player` - Trade a family member
- `GET /api/event-definitions` - Get all life events
- `POST /api/event-definitions` - Create a custom life event  
- `GET /api/logged-events` - Get all logged events
- `POST /api/logged-events` - Log a new event

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` environment variable is set
- Check Heroku Postgres addon is properly provisioned
- Verify database credentials are correct

### Migration Issues
- Run `heroku run npm run migrate -a your-app-name` to reset database
- Check Heroku logs: `heroku logs --tail -a your-app-name`

### Data Not Persisting
- Verify you're no longer using localStorage (check browser dev tools)
- Confirm API endpoints are being called (check Network tab)
- Check server logs for database connection errors

## Project Structure

- `src/` - React components and TypeScript files
- `dist/` - Production build output (created during build)
- `server.js` - Express server with API endpoints
- `db.js` - Database connection and query functions
- `migrate.js` - Database migration script
- `vite.config.ts` - Vite configuration
- `Procfile` - Heroku process configuration