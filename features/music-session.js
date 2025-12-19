const axios = require('axios');

module.exports = (app) => {
  const TARGET_CHANNEL = 'C08JRG8VCBY';
  const API_URL = 'https://ytmusic-tools.onrender.com/getdata';
  const POLL_INTERVAL = 20000; 
  const NULL_TIMEOUT = 30 * 60 * 1000;

  let sessionActive = false;
  let lastMessageTs = null;
  let sessionStartTime = null;
  let lastData = null;
  let nullStartTime = null;

  const formatISTTime = (date) => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const buildMessage = (data, startTime, endTime = null) => {
    const startStr = formatISTTime(startTime);
    const endStr = endTime ? formatISTTime(endTime) : 'Ongoing';
    const contextText = endTime
      ? `Ended At ${endStr}`
      : `Started At ${startStr}`;

    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*:cute-music: New Music Session*',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            emoji: true,
            text: contextText,
          },
        ],
      },
      {
        type: 'divider',
      },
    ];

    if (data && data.title) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${data.title}*\n${data.artist}${data.album ? `\n_${data.album}_` : ''}`,
        },
        accessory: data.artwork && data.artwork.length > 0
          ? {
              type: 'image',
              image_url: data.artwork[0].src,
              alt_text: data.title,
            }
          : undefined,
      });

      blocks.push({
        type: 'divider',
      });
    }

    return blocks;
  };

  const updateMessage = async (blocks) => {
    try {
      if (lastMessageTs) {
        await app.client.chat.update({
          channel: TARGET_CHANNEL,
          ts: lastMessageTs,
          blocks: blocks,
        });

        console.log('✓ Music message updated');
      } else {
        const response = await app.client.chat.postMessage({
          channel: TARGET_CHANNEL,
          blocks: blocks,
        });

        lastMessageTs = response.ts;
        console.log('✓ Music message sent');
      }
    } catch (error) {
      console.error('Error updating music message:', error);
    }
  };

  const pollMusic = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
      if (!data) return;

      if (!data.title) {
        if (!nullStartTime) {
          nullStartTime = new Date();
          console.log('⏹️ Music stopped, tracking null state');
          return;
        }

        const timeSinceNull = new Date() - nullStartTime;
        if (timeSinceNull >= NULL_TIMEOUT && sessionActive) {
          console.log('✓ Session ended after 30 mins of no data');
          const endTime = new Date();

          const blocks = buildMessage(lastData, sessionStartTime, endTime);
          await updateMessage(blocks);

          sessionActive = false;
          lastMessageTs = null;
          sessionStartTime = null;
          lastData = null;
          nullStartTime = null;
          return;
        }

        return;
      }

      nullStartTime = null;

      if (!sessionActive || JSON.stringify(data) !== JSON.stringify(lastData)) {
        if (!sessionActive) {
          console.log('New music session started');
          sessionActive = true;
          sessionStartTime = new Date();
          lastMessageTs = null;
        }

        lastData = data;
        const blocks = buildMessage(data, sessionStartTime);
        await updateMessage(blocks);
      }
    } catch (error) {         
      console.error('Error polling music:', error.response?.status || error.code || error.message || error);
    }
  };

  setInterval(pollMusic, POLL_INTERVAL);
  pollMusic(); 
  console.log('✓ Music session feature loaded');
};
