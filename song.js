
// Node packages/api key & secret
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require('fs');
var moment = require('moment');
require('colors');

// Calls to Spotify API, displays data, and appends data to log.txt
function Song(input) {
    this.validateInput = function(){
        // Conditional controls for if there is no user input
        if (!input) input = 'No Scrubs';
    };
    this.searchSong = function(){
        // call to Spotify API
        spotify.search({type: 'track', query: input})
        .then(function(response) {

            var title = response.tracks.items[0].name;
            var artist = `Artist: ${response.tracks.items[0].album.artists[0].name}`;
            var releaseDate = response.tracks.items[0].album.release_date;
            var album = `Album: ${response.tracks.items[0].album.name}`;
            var url = `URL: ${response.tracks.items[0].album.artists[0].external_urls.spotify}`;

            console.log(`\nHere is some info about ${title}:\n`.magenta);   
            // Song name
            console.log(`Title: ${title}`.cyan);
            // Artist name
            console.log(artist.cyan);
            // Release date
            if (releaseDate !== undefined) {
                var released = moment(releaseDate).format('MMM D YYYY');
                console.log(`Released: ${released}`.cyan);
            }
            // Album that song is from
            console.log(album.cyan);
            // A preview link of the song from Spotify
            console.log(`${url}\n`.cyan);

            // Array contents to be added to log.txt
            var songDetails = [title, artist, `Released: ${released}`, album, url];
            
            // adds input to log.txt
            fs.appendFile('text/log.txt', ',' + songDetails, function(err){
                if (err) console.log(err);
            });
        })
        .catch(function(err) {
            console.log(err);
        });
    }
}

module.exports = Song;