module.exports = (app) => {
  const TARGET_CHANNEL = 'C08JRG8VCBY';

  app.event('member_joined_channel', async ({ event, client }) => {
    try {
      if (event.channel !== TARGET_CHANNEL) {
        return;
      }

      const userId = event.user;
      
      const userInfo = await client.users.info({ user: userId });
      const userName = userInfo.user.real_name || userInfo.user.name;

      // Send welcome message
      await client.chat.postMessage({
        channel: TARGET_CHANNEL,
        text: `Welcome! <@${userId}> just joined, say hi everyone.!\n _if you were kidnapped, feel free to leave!_`,
      });

      console.log(`User ${userName} (${userId}) joined ${TARGET_CHANNEL}`);
    } catch (error) {
      console.error('Error handling member joined:', error);
    }
  });

  app.event('member_left_channel', async ({ event, client }) => {
    try {
      if (event.channel !== TARGET_CHANNEL) {
        return;
      }

      const userId = event.user;
      
      const userInfo = await client.users.info({ user: userId });
      const userName = userInfo.user.real_name || userInfo.user.name;

      // Send goodbye message
      await client.chat.postMessage({
        channel: TARGET_CHANNEL,
        text: `${userName} has left the channel :hs: Bye!`,
      });

      console.log(`User ${userName} (${userId}) left ${TARGET_CHANNEL}`);
    } catch (error) {
      console.error('Error handling member left:', error);
    }
  });

  console.log('✓ Channel join/leave feature loaded');
};
