
// Node packages/api key & secret
const Spotify = require('node-spotify-api');
const keys = require("./keys");
const spotify = new Spotify(keys.spotify);
const fs = require('fs');
const moment = require('moment');
require('colors');

class Song {
    constructor(input){
        this.input = input;
    }

    searchSong() {
        // call to Spotify API
        spotify.search({type: 'track', query: this.input})
        .then(response => {
            let title = response.tracks.items[0].name;
            let artist = `Artist: ${response.tracks.items[0].album.artists[0].name}`;
            let releaseDate = response.tracks.items[0].album.release_date;
            let album = `Album: ${response.tracks.items[0].album.name}`;
            let url = `URL: ${response.tracks.items[0].album.artists[0].external_urls.spotify}`;
            let released;
            if (releaseDate) released = moment(releaseDate).format('MMM D YYYY');
            else released = 'N/A';

            // Print to console
            console.log(`\nHere is some info about ${title}:\n`.magenta);   
            console.log(`Title: ${title} \n${artist} \nReleased: ${released} \n${album} \n${url}\n`.cyan);

            // Array contents to be added to log.txt
            const songDetails = [title, artist, `Released: ${released}`, album, url];
            
            // adds input to log.txt
            fs.appendFile('text/log.txt', ',' + songDetails, err => {
                if (err) console.log(err);
            });
        })
        .catch(err => console.log(err));
    }
}

module.exports = Song;