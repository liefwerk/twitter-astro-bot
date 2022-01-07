# :robot: Twitter Astro Bot

This is a twitter bot that takes tweets written by Thomas Pesquet, filters them with the hashtag '#AlphaFipMusic', adds the youtube video to a playlist then tweets that playlist to that tweet.

## Help

> Start the localhostserver with `node server.js`.
> Start the youtube api with `node youtube-quickstart.js`.
> Start the twitter api with `node twitter-quickstart.js`.

## Issues

For now the issue is that the `insert()` function returns an error: `The API returned an error: Error: Forbidden`.

From the documentation it says either:

1. forbidden (403) 	playlistContainsMaximumNumberOfVideos 	The playlist already contains the maximum allowed number of items.
2. forbidden (403) 	playlistItemsNotAccessible 	The request is not properly authorized to insert the specified playlist item.

For now, I do not know which one it is as I cannot get the description of that error.

## TODO list

- [x] Install a library with yarn for starting a webserver with localhost:8080
- [x] Resolve the issue with the error while inserting new video inside a playlist
- [x] Link both APIs in one single file
