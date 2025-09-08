# Fantasy Family App

## Environment Variables

To run this application, you need to set the following environment variable:

### Local Development

Create a `.env.local` file in the root directory with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Heroku Deployment

Set the environment variable in Heroku:

```bash
heroku config:set GEMINI_API_KEY=your_gemini_api_key_here
```

## Deployment to Heroku

1. Make sure you have the Heroku CLI installed
2. Create a new Heroku app or use existing one
3. Provision Postgres and set environment variables:

   ```bash
   heroku addons:create heroku-postgresql:mini
   heroku config:set GEMINI_API_KEY=your_actual_api_key
   ```

4. (Optional) Import initial state

   If you want to seed initial app state, you can open the app locally, make changes, and then it will persist to Heroku once deployed. Alternatively, you can insert JSON directly:

   ```bash
   heroku pg:psql --app <your-app-name> <<'SQL'
   CREATE TABLE IF NOT EXISTS app_state (
     id TEXT PRIMARY KEY,
     data JSONB NOT NULL,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   INSERT INTO app_state (id, data) VALUES ('default', '{"players":[],"events":[],"lifeEvents":[]}')
   ON CONFLICT (id) DO NOTHING;
   SQL
   ```

5. Deploy:

   ```bash
   git push heroku main
   ```

The app will automatically build and start using the configuration in `Procfile`.

### Notes

- The server exposes `GET /api/state` and `PUT /api/state` to load and persist the entire application state.
- In local development without `DATABASE_URL`, the server falls back to in-memory state.
