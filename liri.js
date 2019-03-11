
// Node package imports
var dotenv = require('dotenv');
dotenv.config({path: './.env'});
var fs = require('fs');
var axios = require('axios');
var inquirer = require('inquirer');
require('colors');

// requiring constructors
var Translator = require('./translator');
var Concerts = require('./concerts');
var Song = require('./song');
var Movie = require('./movie');

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
        case 'concert-this':
            var concert = new Concerts(input);
            concert.getQueryURL();
            concert.axiosConcerts();
        break;
        case 'spotify-this-song':
            var song = new Song(input);
            song.validateInput();
            song.searchSong();
        break;
        case 'movie-this':
            var movie = new Movie(input);
            movie.validateQueryURL();
            movie.searchMovie();
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
            require('owl-wisdom'); // Generates random quote
        break;
        // get translation of input
        case 'translate-this':
            getTranslation();
        break;
    }
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

// Translates input
function getTranslation() {
    var translator = new Translator();
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
                    choices: translator.supportedLanguages,
                    name: 'language'
                }, 
            ]).then(function(reply){
                // sets arguments for translate() to the input - gets WLT code for language to translate to
                var langOne = 'en';
                var langTwo = translator.findLangCode(reply.language);
                translator.translate(reply.text, langOne, langTwo);
            });
        } else {
            inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Select the language you want to translate from:',
                    choices: translator.supportedLanguages,
                    name: 'langOne'
                },
                {
                    name: 'text',
                    message: 'Text to translate:'
                },
            ]).then(function(reply){
                // sets arguments for translate() to the input - gets code for language to translate from
                var langOne = translator.findLangCode(reply.langOne);
                var langTwo = 'en';
                translator.translate(reply.text, langOne, langTwo);
            });
        }
    }); 
}