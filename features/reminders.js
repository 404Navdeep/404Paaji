const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

module.exports = (app) => {
  try {
    const remindersPath = path.join(__dirname, '../reminders.json');
    const remindersData = fs.readFileSync(remindersPath, 'utf8');
    const reminders = JSON.parse(remindersData);

    const timezone = process.env.TIMEZONE || 'Asia/Kolkata';

    reminders.forEach((reminder) => {
      if (reminder.type === 'cron') {
        // Cron-based reminder
        cron.schedule(reminder.schedule, async () => {
          try {
            await app.client.chat.postMessage({
              channel: reminder.channel,
              text: reminder.message,
            });

            console.log(`✓ Reminder sent: ${reminder.id}`);
          } catch (error) {
            console.error(`Error sending reminder ${reminder.id}:`, error);
          }
        }, {
          timezone: timezone,
        });

        console.log(`✓ Scheduled reminder: ${reminder.id} (${reminder.schedule}) - Timezone: ${timezone}`);
      } else if (reminder.type === 'date') {
        cron.schedule('0 * * * *', async () => {
          try {
            const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
            
            if (today === reminder.date) {
              const [hour, minute] = reminder.time.split(':');
              const now = new Date();
              
              if (now.getHours() === parseInt(hour) && now.getMinutes() >= parseInt(minute)) {
                await app.client.chat.postMessage({
                  channel: reminder.channel,
                  text: reminder.message,
                });

                console.log(`✓ Reminder sent: ${reminder.id}`);
              }
            }
          } catch (error) {
            console.error(`Error sending reminder ${reminder.id}:`, error);
          }
        }, {
          timezone: timezone,
        });

        console.log(`✓ Scheduled reminder: ${reminder.id} (Date: ${reminder.date} at ${reminder.time}) - Timezone: ${timezone}`);
      }
    });

    console.log('✓ Reminders feature loaded');
  } catch (error) {
    console.error('Error loading reminders:', error);
  }
};
