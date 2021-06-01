require('dotenv').config()

const needle = require('needle');
// var { tall } = require('tall');
var request = require('request');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.BEARER_TOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

async function getRequest() {

  // Edit query parameters below
  // specify a search query, and any additional fields that are required
  // by default, only the Tweet ID and text fields are returned
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

(async () => {

  try {
    // Make request
    const response = await getRequest();
    // console.dir(response, {
    //   depth: null
    // });
    // get last tweet
    let lastTweet = response.data[0];
    // get last tweet's id & author's id
    // let authorId = lastTweet.author_id;
    // let tweetId = lastTweet.id;
    let text = lastTweet.text;

    // console.log(authorId, tweetId);
    // console.log("last tweet's text", text);

    let regex = /^https.*/mg;
    let found = text.match(regex);
    let link = found[1];
    // console.log("found", found[1]);

    // tall('https://t.co/Jxcm5YTBdW')
    //   .then(function (unshortenedUrl) {
    //     console.log('Tall url', unshortenedUrl)
    //   })
    //   .catch(function (err) {
    //     console.error('AAAW 👻', err)
    //   })

    // var uri = 'https://t.co/Jxcm5YTBdW';
    request(
      {
        uri: link,
        followRedirect: false,
      },
      function (err, httpResponse) {
        if (err) {
          return console.error(err)
        }
        console.log('working');
        console.log(httpResponse || uri);
        console.log(httpResponse.headers.location || uri);
      }
    )

  } catch (e) {
    console.log('error :', e);
    process.exit(-1);
  }
  process.exit();
})();

