require('dotenv').config()

var { tall } = require('tall')
const needle = require('needle');

const token = process.env.BEARER_TOKEN;
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

async function getRequest() {

  const params = {
    'query': 'from:thom_astro -is:retweet #alphafipmusic',
    'tweet.fields': 'author_id'
  }

  const res = await needle('get', endpointUrl, params, {
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

  let videoId;

  try {
    const response = await getRequest();

    let lastTweet = response.data[0];
    let text = lastTweet.text;

    let isLink = /^https.*/mg;
    let links = text.match(isLink);
    secondLink = links[1];

    console.log('Got second link:', secondLink);

    await tall(secondLink, {
      maxRedirect: 10
    }).then(function (fullLink) {

      let isVideoId = /[^=]*$/g;
      let videoIdResults = fullLink.match(isVideoId);
      videoId = videoIdResults[0];

      console.log('Got youtube id:', videoId);

    }).catch(function (err) {
      console.log('error !', err);
    });

  } catch {
    console.log('err');
  }

  return videoId;
};

module.exports = {
  getVideoId
}