module.exports = (app) => {
  const TARGET_CHANNEL = 'C08JRG8VCBY';
  const TARGET_USERGROUP = 'S09KY3K8ZFH';

  app.message(async ({ message, say, client }) => {
    try {
      if (message.channel !== TARGET_CHANNEL) {
        return;
      }

      if (!message.text || !message.text.includes(`<!subteam^${TARGET_USERGROUP}`)) {
        return;
      }

      const channelResponse = await client.chat.postMessage({
        channel: TARGET_CHANNEL,
        text: `:thread: :this: :here:`,
      });

      const sentMessageTs = channelResponse.ts;

      if (message.thread_ts || message.ts) {
        const threadTs = message.thread_ts || message.ts;
        
        await client.chat.postMessage({
          channel: TARGET_CHANNEL,
          thread_ts: threadTs,
          text: `Heyo! Dont send a message here!(It pings everyone:hs:) Send it in <https://slack.com/archives/${TARGET_CHANNEL}/p${sentMessageTs.replace('.', '')}|this> thread instead!`,
        });
      }

      console.log(`User group mentioned in ${TARGET_CHANNEL}, responses sent.`);
    } catch (error) {
      console.error('Error in usergroup mention feature:', error);
    }
  });

  console.log('✓ User group mention feature loaded');
};
