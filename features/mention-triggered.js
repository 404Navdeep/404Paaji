module.exports = (app) => {
  app.event('app_mention', async ({ event, say, client }) => {
    try {
      const userId = event.user;
      const userInfo = await client.users.info({ user: userId });
      const userName = userInfo.user.real_name || userInfo.user.name;

      await say({
        text: `Heyo! <@${userId}>, you mentioned me!`,
        thread_ts: event.thread_ts || event.ts,
      });

      console.log(`Mentioned by ${userName} (${userId})`);
    } catch (error) {
      console.error('Error handling mention:', error);
    }
  });

  console.log('✓ Mention-triggered feature loaded');
};
