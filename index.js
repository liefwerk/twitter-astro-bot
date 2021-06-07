var cron = require('node-cron');
var { addPlaylistItem } = require('./youtube-start')

cron.schedule('* */3 * * *', () => {
  addPlaylistItem();
});