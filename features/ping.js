module.exports = (app) => {
  app.command('/pinger-pingy', async ({ ack, respond }) => {
    ack();
    respond('Pong! 🏓');
  });
};
