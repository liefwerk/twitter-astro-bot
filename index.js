var cron = require('node-cron');
var { addPlaylistItem } = require('./youtube-start')
var { logger } = require('./log-index');


cron.schedule('0 20 * * *', () => {
  addPlaylistItem();
  logger.info('cron job called');
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});
