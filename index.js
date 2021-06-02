var { getVideoId } = require('./twitter-start.js')

const videoId = getVideoId();

videoId
  .then(function (response) {

    console.log('index response:', response);

  }.catch(function (error) {

    console.log('index error:', error)

  }))