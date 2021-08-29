var { addPlaylistItem } = require('./youtube-start')
var { logger } = require('./log-index');

addPlaylistItem();
logger.info('addPlaylistItem called!');
