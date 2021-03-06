
var fs = require('fs');
const path = require('path');
var readline = require('readline');
var { google } = require('googleapis');
const { REPL_MODE_SLOPPY } = require('repl');
var OAuth2 = google.auth.OAuth2;

var { logger } = require('./log-index');

var { getVideoId, postTweet } = require('./twitter-start.js')
const jsonData = require('./data.json')

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtubepartner',
  // 'https://www.googleapis.com/auth/youtube.readonly',
];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  authorize(JSON.parse(content), addPlaylistItem);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function addPlaylistItem(auth) {
  var service = google.youtube('v3');

  logger.info('Calling getVideoId');
  const videoId = getVideoId();

  videoId
    .then(function (response) {

      let lastTweetId = response.tweetId;

      const object = {
        tweetId: lastTweetId,
      }
      const jsonString = JSON.stringify(object);
      const filePath = path.join(process.cwd(), 'data.json');

      if (jsonData.tweetId !== lastTweetId) {

        service.playlistItems.insert({
          auth: auth,
          resource: {
            snippet: {
              playlistId: "PLGo4WhVb-_D_HAIYk7hLxHPeJePcnTBQA",
              resourceId: {
                kind: "youtube#video",
                videoId: response.videoId,
              }
            }
          },
          part: 'snippet, id',
        }).then(function (response) {

          if (response.status === 200) {
            let title = response.data.snippet.title;
            logger.info(`${title} has been added to the playlist.`);

            postTweet(lastTweetId, '???????? La vid??o ?? ??t?? ajout??e ?? la playlist ! https://www.youtube.com/playlist?list=PLGo4WhVb-_D_HAIYk7hLxHPeJePcnTBQA @Thom_astro');

            fs.writeFile(filePath, jsonString, (err) => {
              if (err) {
                console.error(err);
              } else {
                logger.info('Last TweetID has been updated!');
              }
            });
          }

        }).catch(function (err) { console.error("Execute error", err); });

      } else {
        logger.warn('This video has already been added to the playlist!');
      }



    }).catch(function (error) {

      console.log('getVideoId() error', error)

    });

}

module.exports = {
  addPlaylistItem
}