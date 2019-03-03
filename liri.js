
// Node package imports
var dotenv = require('dotenv');
dotenv.config({path: './.env'});
var keys = require("./keys.js");
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var inquirer = require('inquirer');
var colors = require('colors');
var Spotify = require('node-spotify-api');

// Spotify keys
var spotify = new Spotify(keys.spotify);

//  ==============================================================================
// Code for handling watson language translator data
var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
var languageTranslator = new LanguageTranslatorV3(keys.translator);

// Array holds the languages supported for translation to and from English
var supportedLanguages = ['Arabic', 'Czech', 'Danish', 'Dutch', 'Finnish', 'French', 'German', 'Hindi', 'Italian', 'Japanese', 'Korean', 'Norwegian Bokmal', 'Polish', 'Portuguese', 'Russian', 'Simplified Chinese', 'Spanish', 'Swedish', 'Traditional Chinese', 'Turkish'];

// Supported language codes (ordered in respect to supportedLanguages)
var supportedLanguageCodes = ['ar', 'cs', 'da', 'nl', 'fi', 'fr', 'de', 'hi', 'it', 'ja', 'ko', 'nb', 'pl', 'pt', 'ru', 'zh', 'es', 'sv', 'zh-TW', 'tr'];

// Determines the code of a language based on the user's selection
function findLangCode(language) {
    // loops through array until the selected language is found
    for (var i=0; i < supportedLanguages.length; i++) {
        if (supportedLanguages[i] === language) {
            // assigns exact index to supportedLanguageCodes since both arrays are in the same order
            var langFromCode = supportedLanguageCodes[i];
        }
    }
    return langFromCode;
}

// Handles the translation functionality - calls to API and displays response in CL
function translate(string, one, two) {
    // Parameters to be passed through translate functionality below
    // supported translation models here: https://console.bluemix.net/docs/services/language-translator/translation-models.html#translation-models
    var parameters = {
        text: string,
        model_id: `${one}-${two}`
        };

    // call to WLT applying the parameters gained from user input
    languageTranslator.translate(
        parameters,
        function(error, response) {
            if (error) {
            console.log(error);
            } else {
                // loops through response array in case there is more than one translation
                response.translations.forEach(text => {
                console.log(text.translation.cyan);
                // Saving translation to log.txt
                fs.appendFile('text/log.txt', ',' + text.translation, function(err){
                    if (err) console.log(err);
                });
            });
            } 
        }
    );
}
//  ==============================================================================

// User input is saved to global variables
var request;
var input;

// Runs immediately
inquirer
.prompt([
    {
        type: 'list',
        message: 'Hi! My name is Liri. Please choose one of the following:',
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', 'info-saved', 'get-random-quote', 'translate-this'],
        name: 'request'
    }]
).then(function(inquirerResponse) {
    request = inquirerResponse.request;
    if (request === 'concert-this' || request === 'spotify-this-song' || request === 'movie-this') {
        promptSearchTerm();
    } else if (request === 'translate-this') {
        getTranslation();
    } else liri();
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
        // get translation of input
        case 'translate-this':
            getTranslation();
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
    if (!input) queryURL = `https://rest.bandsintown.com/artists/unknown+mortal+orchestra/events?app_id=codingbootcamp`;

    // axios call to BandsInTown API
    axios.get(queryURL)
    .then(function(response){
        var concerts = response.data;
        if (!input) {
            console.log(`\nHere are some upcoming concerts for Unknown Mortal Orchestra:\n`.magenta);
        } else {
            console.log(`\nHere are some upcoming concerts for ${input}:\n`.magenta);
        }
        concerts.forEach(concert => {
            var artist = concert.lineup[0];
            var headline = `${artist} at ${concert.venue.name}`;
            var url = concert.url;
            // Name of Venue
            console.log(headline.green);
            // Venue location
            var location = '';
            if (concert.venue.region) {
                // For locations in US
                location = `Location: ${concert.venue.city} ~ ${concert.venue.region}`;
                console.log(location.cyan);
            } else {
                // International locations do not provide a region, so using country instead
                location = `Location: ${concert.venue.city}, ${concert.venue.country}`;
                console.log(location.cyan);
            }
            // Date of the event (using Moment in MM/DD/YYYY format)
            var date = moment(concert.datetime).format('MMM D YYYY h:mm a');
            console.log(`Date & Time (local): ${date}`.cyan);
            // Link to event
            console.log(`${url}\n`.cyan);

            // Placing values into array for addition to log.txt
            var concertDetails = [];
            concertDetails.push(artist);
            concertDetails.push(headline);
            concertDetails.push(location);
            concertDetails.push(date);
            concertDetails.push(`${url}\n`);

            // adds output to log.txt
            fs.appendFile('text/log.txt', ', ' + concertDetails, function(err){
                if (err) console.log(err);
            });
        });
    })
    .catch(function(error){
        console.log(`Error: ${error}`);
    });   
}
    
// Calls to Spotify API, displays data, and appends data to log.txt
function getSong() {

    // Conditional controls for if there is no user input
    if (!input) input = 'No Scrubs';

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
     
// Calls to OMDB API, displays data, and appends data to log.txt
function getMovie() {

    var queryURL = `http://www.omdbapi.com/?apikey=trilogy&t=${input}`;
    // Conditional controls for if there is no user input
    if (!input) queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=am%C3%A9lie";
    
    // axios call to OMDB API
    axios.get(queryURL)
    .then(function(response){

        var title = response.data.Title;
        var year = `Released in: ${response.data.Year}`;
        var director = `Directed by: ${response.data.Director}`;
        var imdb = `${response.data.Ratings[0].Source} rating: ${response.data.Ratings[0].Value}`;
        var rottenTomato = `${response.data.Ratings[1].Source} rating: ${response.data.Ratings[1].Value}`;
        var country = `Produced in: ${response.data.Country}`;
        var language = `Language(s): ${response.data.Language}`;
        var plot = `Plot: ${response.data.Plot}`;
        var actors = `Featuring: ${response.data.Actors}\n`;

        console.log(`\nHere are some details for ${title}:\n`.magenta);
        // Title
        console.log(`Movie title: ${title}`.cyan);
        // Release year
        console.log(year.cyan);
        // Director
        console.log(director.cyan);
        // IMDB Rating
        console.log(imdb.cyan);
        // Rotten tomatoes rating
        console.log(rottenTomato.cyan);
        // Country where movie was produced
        console.log(country.cyan);
        // language of movie
        console.log(language.cyan);
        // plot of movie
        console.log(plot.cyan);
        // actors in movie
        console.log(actors.cyan);
        // Array to be added to log.txt
        var movieDetails = [title, year, director, imdb, rottenTomato, country, language, plot, actors];
        // adds output to log.txt
        fs.appendFile('text/log.txt', ',' + movieDetails, function(err){
            if (err) console.log(err);
        });
    })
    .catch(function(err){
        console.log(`Error: ${err}`);
    });   
}
    
// Reads data from random.txt and displays info using this data as input
function random() {
    // using fs package, call spotify-this-song on data in random.txt
    fs.readFile('text/random.txt', 'utf8', function(err, data) {
        if (err) throw err; // checking for error
        // save data to array split on the ,'s
        var dataArr = data.split(',');
        // Generates random number that will identify the index of the request
        var randomNumIndex = Math.floor(Math.random() * 5);
        // Accounts for odd indexes (since these contain values rather than commands)
        if (randomNumIndex % 2 !== 0 && randomNumIndex !== 4) {
            randomNumIndex++;
        }
        // Loops through data array and identifies the item in the array whose index matches the random index
        for (var i=0; i < dataArr.length; i++) {
            if (i === randomNumIndex) {
                request = dataArr[i];
                input = dataArr[i + 1];
            }
        }
        // Reruns Liri with the values from random.txt
        liri();
    });
}

// Retrieves and displays all data saved in log.txt
function getData() {
    fs.readFile('text/log.txt', 'utf8', function(err, data){
        if (err) throw err;
        if (!data) {
            console.log('\nSorry, no data could be found.\n'.magenta);
        } else {
            console.log('\nHere is your requested data:\n'.magenta);
            var dataArr = data.split(',');
            dataArr.forEach(item => console.log(item.yellow));
        }
    });
}

// Generates random quote
function getQuote() {
    require('owl-wisdom');
}

// Translates input
function getTranslation() {
    // prompts whether user wants to translate to or from english
    inquirer
    .prompt({
        type: 'list',
        message: 'Translate:',
        choices: ['to English', 'from English'],
        name: 'languageChoice'
    }).then(function(reply){
        if (reply.languageChoice === 'from English') {
            inquirer
            .prompt([
                {
                    name: 'text',
                    message: 'Text to translate:'
                },
                {
                    type: 'list',
                    message: 'Select the language you want to translate to:',
                    choices: supportedLanguages,
                    name: 'language'
                }, 
            ]).then(function(reply){
                // sets arguments for translate() to the input - gets WLT code for language to translate to
                var langOne = 'en';
                var langTwo = findLangCode(reply.language);
                translate(reply.text, langOne, langTwo);
            });
        } else {
            inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Select the language you want to translate from:',
                    choices: supportedLanguages,
                    name: 'langOne'
                },
                {
                    name: 'text',
                    message: 'Text to translate:'
                },
            ]).then(function(reply){
                // sets arguments for translate() to the input - gets code for language to translate from
                var langOne = findLangCode(reply.langOne);
                var langTwo = 'en';
                translate(reply.text, langOne, langTwo);
            });
        }
    }); 
}