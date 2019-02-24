
var dotenv = require('dotenv');
dotenv.config({path: './.env'});

// Saved keys
var keys = require("./keys.js");
// console.log(keys.spotify);
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
// Spotify key
var spotify = new Spotify(keys);

// saving parameters as variable
var request = process.argv[2];
var input = process.argv.slice(3).join(' ');

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

    var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;

    if (!artist) {
        queryURL = `https://rest.bandsintown.com/artists/unknown+mortal+orchestra/events?app_id=codingbootcamp`
    }

    // axios call to BandsInTown API
    axios.get(queryURL)
    .then(function(response){
        var concerts = response.data;
        concerts.forEach(concert => {
            console.log(`\nHere are some upcoming concerts for ${concert.lineup[0]}:`);
            // Name of Venue
            console.log(`\n${concert.lineup[0]} at ${concert.venue.name}`);
            // Venue location
            if (concert.venue.region) {
                // For locations in US
                console.log(`Location: ${concert.venue.city}, ${concert.venue.region}`);
            } else {
                // International locations do not provide a region, so using country instead
                console.log(`Location: ${concert.venue.city}, ${concert.venue.country}`);
            }
            // Date of the event (using Moment in MM/DD/YYYY format)
            var date = moment(concert.datetime).format('MMM D YYYY h:mm a');
            console.log(`Date & Time (local): ${date}`);
            // Link to event
            console.log(`More info: ${concert.url}\n`);
        });
    })
    .catch(function(error){
        console.log(`Error: ${error}`);
    });  

    // adds input to log.txt
    fs.appendFile('text/log.txt', ', ' + artist.trim(), function(err){

        if (err) {
            console.log(err);
        }
    });
}
    
// Function called when spotify-this-song is the parameter
function getSong() {
    // Stores song name as variable
    var song = input;

    if (!song) {
        song = 'Scrubs';
    }

    // call to Spotify API
    spotify.search({type: 'track', query: song})
    .then(function(response) {
        console.log(`\nHere is some info about ${response.tracks.items[0].name}:\n`);   
        // Song name
        console.log(`Title: ${response.tracks.items[0].name}`);
        // Artist name
        console.log(`Artist: ${response.tracks.items[0].album.artists[0].name}`);
        // Release date
        if (response.tracks.items[0].album.release_date !== undefined) {
            var released = moment(response.tracks.items[0].album.release_date).format('MMM D YYYY');
            console.log(`Released: ${released}`);
        }
        // Album that song is from
        console.log(`Album: ${response.tracks.items[0].album.name}`);
        // A preview link of the song from Spotify
        console.log(`URL: ${response.tracks.items[0].album.artists[0].external_urls.spotify}\n`);
        })
        .catch(function(err) {
        console.log(err);
        });
        
    // adds input to log.txt
    fs.appendFile('text/log.txt', ', ' + song.trim(), function(err){

        if (err) {
            console.log(err);
        }
    });
}
     
// Function called when movie-this is the parameter
function getMovie() {
    // Saving movie name to variable
    var movie = input;

    var queryURL = `http://www.omdbapi.com/?apikey=trilogy&t=${movie}`;

    if (!movie) {
        queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=am%C3%A9lie";
    }
    // axios call to OMDB API
    axios.get(queryURL)
    .then(function(response){
        console.log(`\nHere are some details for ${response.data.Title}:\n`);
        // Title
        console.log(`Movie title: ${response.data.Title}`);
        // Release year
        console.log(`Released in: ${response.data.Year}`);
        // Director
        console.log(`Directed by: ${response.data.Director}`);
        // IMDB Rating
        console.log(`${response.data.Ratings[0].Source} rating: ${response.data.Ratings[0].Value}`);
        // Rotten tomatoes rating
        console.log(`${response.data.Ratings[1].Source} rating: ${response.data.Ratings[1].Value}`);
        // Country where movie was produced
        console.log(`Produced in: ${response.data.Country}`);
        // language of movie
        console.log(`Language(s): ${response.data.Language}`);
        // plot of movie
        console.log(`Plot: ${response.data.Plot}`);
        // actors in movie
        console.log(`Featuring: ${response.data.Actors}\n`);
    })
    .catch(function(err){
        console.log(`Error: ${err}`);
    });  

    // adds input to log.txt
    fs.appendFile('text/log.txt', ', ' + movie.trim(), function(err){

        if (err) {
            console.log(err);
        }
    });
}
    
// Function called when do-what-it-says is the parameter
function random() {
    // using fs package, call spotify-this-song on data in random.txt
    fs.readFile('text/random.txt', 'utf8', function(err, data) {

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
    fs.readFile('text/log.txt', 'utf8', function(err, data){

        if (err) {
            console.log(err);
        }

        if (!data) {
            console.log('\nSorry, no data could be found.\n');
        } else {
            console.log('\nHere is your requested data:\n');
            var dataArr = data.split(',');
            dataArr.forEach(item => console.log(item));
        }
    });
}

liri();