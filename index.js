var cron = require('node-cron');
var { addPlaylistItem } = require('./youtube-start')
var { logger } = require('./log-index');

addPlaylistItem();
logger.info('cron job called');
