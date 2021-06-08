var cron = require('node-cron');
var { addPlaylistItem } = require('./youtube-start')

cron.schedule('*/10 10-15 * * *', () => {
  addPlaylistItem();
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});