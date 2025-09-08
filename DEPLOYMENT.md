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
3. Set the environment variable:

   ```bash
   heroku config:set GEMINI_API_KEY=your_actual_api_key
   ```

4. Deploy:

   ```bash
   git push heroku main
   ```

The app will automatically build and start using the configuration in `Procfile`.
