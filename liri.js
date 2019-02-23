
// require("dotenv").config();

// Saved keys
// var keys = require("./keys.js");
var fs = require('fs');

// Spotify key
// var spotify = new Spotify(keys.spotify);

// saving first parameter as variable
var request = process.argv[2];
var input = process.argv[3];

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
    default:
        console.log('Please enter one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says');
    break;
}

// FUNCTIONS

// Function called when concert-this is the parameter
function getConcert() {
    // takes in artist's name as parameter
    var artist = input;
    // axios call to BandsInTown API
    // if a parameter is NOT undefined 
    if (artist !== undefined) {
        // Liri's reply
        console.log(`Excellent choice! I, too, love ${artist}.`);
        console.log('Some info about concerts for that artist.');
        // render:
            // Name of Venue
            // Venue location
            // Date of the event (using Moment in MM/DD/YYYY format)
    // else = > run above with default artist name
    } else {
        console.log('Random concert info!');
    }
}
    
// Function called when spotify-this-song is the parameter
function getSong() {
    // Stores song name as variable
    var song = input;
    // axios call to Spotify API
    // if parameter is entered
    if (song !== undefined) {
        // Liri's reply
        console.log(`"${song}" is one of the greatest songs of our time.`);
        console.log("Here's some stuff about your selected song.");
        // render:
            // Artist name
            // Song name
            // A preview link of the song from Spotify
            // Album that song is from
    } else { 
        // else => do the above with "The Sign" by Ace of Base
        console.log("Here's some stuff about a random song.");
    }
}
     
// Function called when movie-this is the parameter
function getMovie() {
    // Saving movie name to variable
    var movie = input;
    // axios call to OMDB API
    // if parameter is entered
    if (movie !== undefined) {
        // Liri's reply
        console.log(`"${movie}" is a beautiful film. It always brings me to tears.`);
        console.log("Here's some stuff about your requested movie.");
        // render:
            // Title
            // Release year
            // IMDB Rating
            // Rotten tomatoes rating
            // Country where movie was produced
            // language of movie
            // plot of movie
            // actors in movie
    } else {
        // else => do the above with 'mr. nobody'
        console.log("Here's random info about a random movie.");
    }
}
    
// Function called when do-what-it-says is the parameter
function random() {
    console.log('You choose randomly.');
    // using fs package, call spotify-this-song on data in random.txt
    fs.readFile('random.txt', 'utf8', function(err, data) {

        if (err) {
            console.log(err);
        }

        var dataArr = data.split(',');
        console.log(dataArr[1]);

    })

}



