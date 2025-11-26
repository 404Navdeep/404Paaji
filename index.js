require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');
const path = require('path');

const app = new App({
  token: process.env.SLACK__BOT_TOKEN,
  signingSecret: process.env.SLACK__SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK__APP_TOKEN,
});

const featuresDir = path.join(__dirname, 'features');
fs.readdirSync(featuresDir).forEach((file) => {
  if (file.endsWith('.js')) {
    const feature = require(path.join(featuresDir, file));
    feature(app);
    console.log(`Loaded feature: ${file}`);
  }
});

(async () => {
  await app.start();
  console.log('Slack bot is running!');
})();
