require('dotenv').config()

var { tall } = require('tall')
const needle = require('needle');

const token = process.env.BEARER_TOKEN;

const endpointRecent = "https://api.twitter.com/2/tweets/search/recent";
const endpointUpdate = "https://api.twitter.com/1.1/statuses/update.json";

var { logger } = require('./log-index');

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET
});

async function postTweet(tweetId, message) {

  var params = { status: message, in_reply_to_status_id: tweetId };

  await client.post('statuses/update', params)
    .then(function (response) {
      logger.info('The tweet has been sent.', tweetId);
    }).catch(function (error) {
      logger.error("The tweet hasn't been sent", error);
    })
}

async function getRequest() {

  const params = {
    'query': 'from:thom_astro -is:retweet #alphafipmusic',
    'tweet.fields': 'author_id'
  }

  const res = await needle('get', endpointRecent, params, {
    headers: {
      "User-Agent": "v2RecentSearchJS",
      "authorization": `Bearer ${token}`
    }
  })

  if (res.body) {
    return res.body;
  } else {
    console.log('error get Request');
    throw new Error('Unsuccessful request');
  }
}

async function getVideoId() {

  let vals = {
    tweetId: null,
    videoId: null
  }

  try {
    const response = await getRequest();

    let lastTweet = response.data[0];
    let text = lastTweet.text;
    vals.tweetId = lastTweet.id

    let isLink = /^https.*/mg;
    let links = text.match(isLink);
    secondLink = links[1];

    await tall(secondLink, {
      maxRedirect: 10
    }).then(function (fullLink) {

      const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[^&\s\?]+(?!\S))\/)|(?:\S*v=|v\/)))([^&\s\?]+)/mg;
      let m;

      while ((m = regex.exec(fullLink)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        vals.videoId = m[1];
      }

    }).catch(function (err) {
      console.log('error !', err);
    });

  } catch {
    console.log('err');
  }

  return vals;
};

module.exports = {
  getVideoId,
  postTweet
}