
// Node package imports
var dotenv = require('dotenv');
dotenv.config({path: './.env'});
var keys = require("./keys.js");
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');

// Spotify keys
var spotify = new Spotify(keys);

// User input is saved to global variables
var request = '';
var input = '';

// Runs immediately
inquirer
.prompt([
    {
        type: 'list',
        message: 'Hi! My name is Liri. Please choose one of the following:',
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', 'info-saved', 'get-random-quote'],
        name: 'request'
    }]
).then(function(inquirerResponse) {
    request = inquirerResponse.request;
    if (request === 'concert-this' || request === 'spotify-this-song' || request === 'movie-this') {
        promptSearchTerm();
    } else {
        liri();
    }
});

// Runs only if user selects to search concerts, songs, or movies - prompts for search term
function promptSearchTerm() {
    inquirer
    .prompt(
        {
            type: 'input',
            message: 'Enter search term:',
            name: 'searchTerm'
        }
    )
    .then(function(inquirerResponse){
        input = inquirerResponse.searchTerm;
        liri();
    });
}

// Controls the flow of running functions based on the user's request
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
        // return all data
        case 'info-saved':
            getData();
        break;
        // return random quote
        case 'get-random-quote':
            getQuote();
        break;
        default:
            return;
        break;
    }
}

// Calls to BandsInTown API, displays data, and appends data to log.txt
function getConcert() {
    
    var queryURL = `https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`;

    // Conditional controls for if there is no user input
    if (!input) {
        queryURL = `https://rest.bandsintown.com/artists/unknown+mortal+orchestra/events?app_id=codingbootcamp`;
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
    fs.appendFile('text/log.txt', ', ' + input, function(err){

        if (err) {
            console.log(err);
        }
    });
}
    
// Calls to Spotify API, displays data, and appends data to log.txt
function getSong() {
   
    // Conditional controls for if there is no user input
    if (!input) {
        input = 'No Scrubs';
    }

    // call to Spotify API
    spotify.search({type: 'track', query: input})
    .then(function(response) {

        var title = response.tracks.items[0].name;
        var artist = response.tracks.items[0].album.artists[0].name;
        var releaseDate = response.tracks.items[0].album.release_date;
        var album = response.tracks.items[0].album.name;
        var url = response.tracks.items[0].album.artists[0].external_urls.spotify;

        console.log(`\nHere is some info about ${title}:\n`);   
        // Song name
        console.log(`Title: ${title}`);
        // Artist name
        console.log(`Artist: ${artist}`);
        // Release date
        if (releaseDate !== undefined) {
            var released = moment(releaseDate).format('MMM D YYYY');
            console.log(`Released: ${released}`);
        }
        // Album that song is from
        console.log(`Album: ${album}`);
        // A preview link of the song from Spotify
        console.log(`URL: ${url}\n`);

        var songDetails = [title, artist, releaseDate, album, url];
        // adds input to log.txt
        fs.appendFile('text/log.txt', ',' + songDetails, function(err){

            if (err) {
                console.log(err);
            }

        });
        })
        .catch(function(err) {
        console.log(err);
        });
}
     
// Calls to OMDB API, displays data, and appends data to log.txt
function getMovie() {

    var queryURL = `http://www.omdbapi.com/?apikey=trilogy&t=${input}`;

    // Conditional controls for if there is no user input
    if (!input) {
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
    fs.appendFile('text/log.txt', ', ' + input, function(err){

        if (err) {
            console.log(err);
        }
    });
}
    
// Reads data from random.txt and displays info using this data as input
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

// Retrieves and displays all data saved in log.txt
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

// Generates random quote
function getQuote() {
    require('owl-wisdom');
}