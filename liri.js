
require("dotenv").config();

// Saved keys
var keys = require("./keys.js");
var fs = require('fs');

// Spotify key
var spotify = new Spotify(keys.spotify);

// saving first parameter as variable
var request = process.argv[2];

// Commands that LIRI will take in:

// Create a switch statement that identifies each parameter

// concert-this
    
// spotify-this-song

// movie-this

// do-what-it-says

switch (request) {
    case 'concert-this':
        console.log('You searched for concerts.');
    break;
    case 'spotify-this-song':
        console.log('You searched for a song.');
    break;
    case 'movie-this':
        console.log('You searched a movie.');
    break;
    case 'do-what-it-says':
        console.log('You choose randomly.');
    break;
    default:
        console.log('Please select one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says');
    break;
}

// FUNCTIONS

// Function called when concert-this is the parameter

    // takes in artist's name as parameter
    // axios call to BandsInTown API
    // if a parameter is entered
        // render:
            // Name of Venue
            // Venue location
            // Date of the event (using Moment in MM/DD/YYYY format)
    // else
        // run above with default artist name


// Function called when spotify-this-song is the parameter

    // takes in song name 
    // axios call to Spotify API
    // if parameter is entered
        // render:
            // Artist name
            // Song name
            // A preview link of the song from Spotify
            // Album that song is from
    // else
        // do the above with "The Sign" by Ace of Base

// Function called when movie-this is the parameter

    // takes in movie name
    // axios call to OMDB API
    // if parameter is entered
        // render:
            // Title
            // Release year
            // IMDB Rating
            // Rotten tomatoes rating
            // Country where movie was produced
            // language of movie
            // plot of movie
            // actors in movie
    // else 
        // do the above with 'mr. nobody'

// Function called when do-what-it-says is the parameter

// using fs package, call spotify-this-song on data in random.txt


