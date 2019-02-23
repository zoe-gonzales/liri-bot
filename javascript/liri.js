
// require("dotenv").config({path: '../.env'});
var dotenv = require('dotenv');
dotenv.config({path: '../.env'});

// Saved keys
var keys = require("../keys.js");
// console.log(keys.spotify);
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');
// Spotify key
var spotify = new Spotify(keys);

// saving first parameter as variable
var params = process.argv;
var request = process.argv[2];
var input = '';

for (var i=3; i < params.length; i++) {
    input += process.argv[i] + ' ';
}

function liri() {
    // Switch statement identifies request, determines action to be taken
    switch (request) {
        // concert-this
        case 'concert-this':
            getConcert();
        break;
        // spotify-this-song
        case 'spotify-this-song':
            getSong();
        break;
        // movie-this
        case 'movie-this':
            getMovie();
        break;
        // do-what-it-says
        case 'do-what-it-says':
            random();
        break;
        case 'info-saved':
            getData();
        break;
        default:
            console.log('Please enter one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says, info-saved');
        break;
    }
}


// FUNCTIONS

// Function called when concert-this is the parameter
function getConcert() {
    // takes in artist's name as parameter
    var artist = input;
    // if a parameter is NOT undefined 
    if (artist !== undefined) {
        // Liri's reply
        console.log(`Excellent choice! I, too, love ${artist.trim()}.`);
        console.log('Some info about concerts for that artist.');
        
        // axios call to BandsInTown API
        // render:
            // Name of Venue
            // Venue location
            // Date of the event (using Moment in MM/DD/YYYY format)

        // adds input to log.txt
        fs.appendFile('../text/log.txt', ', ' + artist.trim(), function(err){

            if (err) {
                console.log(err);
            }
        });

        
    // else = > run above with default artist name
    } else {
        console.log('Random concert info!');
    }
}
    
// Function called when spotify-this-song is the parameter
function getSong() {
    // Stores song name as variable
    var song = input;
    // if parameter is entered
    if (song !== undefined) {
        // Liri's reply
        console.log(`${song.trim()} is one of the greatest songs of our time.`);
        console.log("Here's some stuff about your selected song.");        
        // call to Spotify API
        spotify.search({type: 'track', query: song})
        .then(function(response) {
            // Song name
            console.log(`Title: ${response.tracks.items[0].name}`);
            // Artist name
            console.log(`Artist: ${response.tracks.items[0].album.artists[0].name}`);
            // Release date
            if (response.tracks.items[0].album.release_date !== undefined) {
                console.log(`Released: ${response.tracks.items[0].album.release_date}`);
            }
            // Album that song is from
            console.log(`Album: ${response.tracks.items[0].album.name}`);
            // A preview link of the song from Spotify
            console.log(`URL: ${response.tracks.items[0].album.artists[0].external_urls.spotify}`);
          })
          .catch(function(err) {
            console.log(err);
          });
          
        // adds input to log.txt
        fs.appendFile('../text/log.txt', ', ' + song.trim(), function(err){

            if (err) {
                console.log(err);
            }
        });

    } else { 
        // else => do the above with "The Sign" by Ace of Base
        console.log("Here's some stuff about a random song.");
    }
}
     
// Function called when movie-this is the parameter
function getMovie() {
    // Saving movie name to variable
    var movie = input;
    // if parameter is entered
    if (movie !== undefined) {
        // Liri's reply
        console.log(`${movie.trim()} is a beautiful film. It always brings me to tears.`);
        console.log("Here's some stuff about your requested movie.");
        // axios call to OMDB API
        // render:
            // Title
            // Release year
            // IMDB Rating
            // Rotten tomatoes rating
            // Country where movie was produced
            // language of movie
            // plot of movie
            // actors in movie

        // adds input to log.txt
        fs.appendFile('../text/log.txt', ', ' + movie.trim(), function(err){

            if (err) {
                console.log(err);
            }
        });
    
    } else {
        // else => do the above with 'mr. nobody'
        console.log("Here's random info about a random movie.");
    }
}
    
// Function called when do-what-it-says is the parameter
function random() {
    console.log('You choose randomly.');
    // using fs package, call spotify-this-song on data in random.txt
    fs.readFile('../text/random.txt', 'utf8', function(err, data) {

        if (err) {
            console.log(err);
        }
        // save data to array split on the ,'s
        var dataArr = data.split(',');
        request = dataArr[0];
        input = dataArr[1];
        // rerun liri
        liri();
    })

}

// Function retrieves and displays data saved in log.txt
function getData() {
    fs.readFile('log.txt', 'utf8', function(err, data){

        if (err) {
            console.log(err);
        }

        if (!data) {
            console.log('Sorry, no data could be found.');
        } else {
            console.log('Here is your requested data:');
            console.log(data);
        }
    });
}

liri();



