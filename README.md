# Slack Bot

A modular Slack bot built with Node.js and Bolt for Slack.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a Slack App** at https://api.slack.com/apps

3. **Get your credentials:**
   - Bot User OAuth Token (starts with `xoxb-`)
   - Signing Secret
   - App-Level Token (starts with `xapp-1-`)

4. **Update `.env` file:**
   ```
   SLACK_BOT_TOKEN=xoxb-your-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-1-your-app-token
   ```

5. **Run the bot:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── index.js              # Main entry point
├── package.json          # Dependencies
├── .env                  # Environment variables
└── features/
    ├── ping.js           # /ping command
    ├── hello.js          # /hello command and "hello" message
    ├── reactions.js      # Reaction event handlers
    └── [your-feature].js # Add more features here
```

## Adding Features

Each feature is a single file in the `features/` directory. Create a new file and export a function that receives the `app` instance:

```javascript
// features/my-feature.js
module.exports = (app) => {
  app.command('/mycommand', async ({ ack, respond }) => {
    ack();
    respond('Feature response');
  });
};
```

Features are automatically loaded when the bot starts.

## Available Events

- `command` - Slash commands
- `message` - Text messages
- `reaction_added` / `reaction_removed` - Emoji reactions
- `app_mention` - Bot mentions
- And more...

See [Bolt docs](https://slack.dev/bolt-js/) for full documentation.
