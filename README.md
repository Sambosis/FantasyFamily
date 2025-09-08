# Fantasy Family

A React application for managing fantasy family leagues.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment to Heroku

This application is configured to deploy to Heroku automatically.

### Prerequisites
- Heroku CLI installed
- Git repository initialized

### Deployment Steps

1. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables (if needed):
   ```bash
   heroku config:set GEMINI_API_KEY=your_api_key_here
   ```

3. Deploy to Heroku:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

4. Open your app:
   ```bash
   heroku open
   ```

### Environment Variables

The following environment variables can be set in Heroku:

- `GEMINI_API_KEY`: API key for Gemini services

### Build Process

The application uses the following build process on Heroku:

1. `heroku-postbuild` script runs `npm run build` to create the production build
2. The `start` script serves the built application using Express
3. Static files are served from the `dist` directory
4. All routes are handled by the React application for client-side routing

## Project Structure

- `src/` - Source files (React components, etc.)
- `dist/` - Production build output (created during build)
- `server.js` - Express server for serving the built application
- `vite.config.ts` - Vite configuration
- `Procfile` - Heroku process configuration