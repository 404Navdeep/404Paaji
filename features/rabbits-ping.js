module.exports = (app) => {
  const TARGET_CHANNEL = 'C08JRG8VCBY';
  const RABBITS_USERGROUP = 'S09KY3K8ZFH';

  app.message(async ({ message, client }) => {
    try {
      if (message.channel !== TARGET_CHANNEL) {
        return;
      }

      if (!message.thread_ts) {
        return;
      }

      const threadMessages = await client.conversations.replies({
        channel: TARGET_CHANNEL,
        ts: message.thread_ts,
      });

      if (!threadMessages.messages || threadMessages.messages.length === 0) {
        return;
      }

      const parentText = threadMessages.messages[0].text;

      if (!parentText || !parentText.includes(`<!subteam^${RABBITS_USERGROUP}`)) {
        return;
      }

      await client.chat.postMessage({
        channel: TARGET_CHANNEL,
        thread_ts: message.thread_ts,
        text: `Heyo! Dont send a message here! (It pings everyone :hs:). Sent it in <#${TARGET_CHANNEL}> instead `,
      });

      console.log(`Rabbits mentioned, response sent in thread`);
    } catch (error) {
      console.error('Error in rabbits ping feature:', error);
    }
  });

  console.log('✓ Rabbits ping feature loaded');
};
