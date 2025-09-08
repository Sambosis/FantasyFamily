# Deployment Guide for Fantasy Family on Heroku

## Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku app created

## Database Setup

### 1. Add PostgreSQL to your Heroku app
```bash
heroku addons:create heroku-postgresql:mini
```

This will automatically set the `DATABASE_URL` environment variable in your Heroku app.

### 2. Verify Database Connection
```bash
heroku config
```
You should see `DATABASE_URL` in the output.

## Deployment Steps

### 1. Ensure all changes are committed
```bash
git add .
git commit -m "Add persistent database storage with PostgreSQL"
```

### 2. Deploy to Heroku
```bash
git push heroku main
```
Or if your branch is named differently:
```bash
git push heroku your-branch-name:main
```

### 3. Check Application Logs
```bash
heroku logs --tail
```

### 4. Open Your App
```bash
heroku open
```

## Environment Variables

The following environment variables are automatically set by Heroku:
- `DATABASE_URL` - PostgreSQL connection string (set by Heroku Postgres addon)
- `PORT` - Port number for the web server
- `NODE_ENV` - Set to "production" on Heroku

## Database Management

### View Database Info
```bash
heroku pg:info
```

### Connect to Database
```bash
heroku pg:psql
```

### Reset Database (if needed)
```bash
heroku pg:reset DATABASE_URL --confirm your-app-name
```

Then restart your app to reinitialize:
```bash
heroku restart
```

## Troubleshooting

### If the app doesn't start:
1. Check logs: `heroku logs --tail`
2. Ensure PostgreSQL addon is installed: `heroku addons`
3. Verify DATABASE_URL is set: `heroku config`

### If data isn't persisting:
1. Check database connection in logs
2. Verify tables were created: 
   ```bash
   heroku pg:psql
   \dt
   ```

### To manually run database initialization:
```bash
heroku run node -e "import('./server/db.js').then(db => db.initializeDatabase())"
```

## Features

### What's New:
1. **PostgreSQL Database**: All data is now stored in a PostgreSQL database instead of browser localStorage
2. **Real-time Sync**: Changes made by one user are automatically reflected for all other users using Socket.io
3. **Persistent Storage**: Data persists across all devices and browsers
4. **API Endpoints**: RESTful API for all data operations

### How It Works:
- When you make any change (add player, log event, etc.), it's saved to the PostgreSQL database
- Socket.io broadcasts the change to all connected clients
- All clients automatically refresh their data to show the latest updates
- No more separate states per computer - everyone sees the same data!

## Important Notes

1. **Free Tier Limitations**: 
   - Heroku's free PostgreSQL tier (mini plan) has a 10,000 row limit
   - The free dyno sleeps after 30 minutes of inactivity

2. **Data Migration**: 
   - First deployment will start with fresh data
   - The app will seed initial players (Shannon and Sam) and default life events

3. **Performance**: 
   - Real-time updates may have slight delays (typically < 1 second)
   - Database queries are optimized for the expected data volume