# :robot: Twitter Astro Bot

This is a twitter bot that takes tweets written by Thomas Pesquet, filters them with the hastag '#AlphaFipMusic', adds the youtube video to a playlist the Tweets that playlist to that tweet.

## issues

For now the issue is that the `insert()` function returns an error: `The API returned an error: Error: Forbidden`.

From the documentation it says either:

1. forbidden (403) 	playlistContainsMaximumNumberOfVideos 	The playlist already contains the maximum allowed number of items.
2. forbidden (403) 	playlistItemsNotAccessible 	The request is not properly authorized to insert the specified playlist item.

For now, I do not know which one it is as I cannot get the description of that error.

## TODO list

[x] Install a library with yarn for starting a webserver with localhost:8080
[ ] Resolve the issue with the error while inserting new video inside a playlist