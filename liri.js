
// Node package imports
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const fs = require('fs');
const inquirer = require('inquirer');
require('colors');

// requiring constructors
const Translator = require('./js_modules/translator');
const Concerts = require('./js_modules/concerts');
const Song = require('./js_modules/song');
const Movie = require('./js_modules/movie');
const SavedData = require('./js_modules/savedData');

// User input is saved to global variables
let request;

// Runs immediately
inquirer
.prompt([
    {
        type: 'list',
        message: 'Hi! My name is Liri. Please choose one of the following:',
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', 'info-saved', 'get-random-quote', 'translate-this'],
        name: 'request'
    }]
).then(inquirerResponse => {
    request = inquirerResponse.request;
    switch (request){
        case 'concert-this':
        case 'spotify-this-song':
        case 'movie-this':
            promptSearchTerm();
        break;
        case 'translate-this':
            getTranslation();
        break;
        default:
            liri();
        break;
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
    .then(inquirerResponse => {
        let input = inquirerResponse.searchTerm;
        liri(input);
    });
}

// Controls the flow of running functions based on the user's request
function liri(input) {
    // Switch statement identifies request, determines action to be taken
    switch (request) {
        case 'concert-this':
            if (!input) input = 'Unknown Mortal Orchestra';
            let concert = new Concerts(input);
            concert.axiosConcerts();
        break;
        case 'spotify-this-song':
            if (!input) input = 'No Scrubs';
            let song = new Song(input);
            song.searchSong();
        break;
        case 'movie-this':
            if (!input) input = 'am%C3%A9lie';
            let movie = new Movie(input);
            movie.searchMovie();
        break;
        case 'do-what-it-says':
            random();
        break;
        case 'info-saved': // returns all saved search results
            let data = new SavedData();
            data.getSavedData();
        break;
        case 'get-random-quote':
            require('owl-wisdom'); // Generates random quote
        break;
        case 'translate-this':
            getTranslation(); // gets translation of input
        break;
    }
}

// Reads data from random.txt and displays info using this data as input
function random() {
    // using fs package, call spotify-this-song on data in random.txt
    fs.readFile('./text/random.txt', 'utf8', function(err, data) {
        if (err) throw err;
        let dataArr = data.split(',');

        // Random index generated
        let randomNumIndex = Math.floor(Math.random() * 5);

        // Accounts for odd indexes (since these contain values rather than commands)
        if (randomNumIndex % 2 !== 0 && randomNumIndex !== 4) randomNumIndex++;

        // Loops through data array and identifies the item in the array whose index matches the random index
        for (let i=0; i < dataArr.length; i++) {
            if (i === randomNumIndex) {
                request = dataArr[i];
                input = dataArr[i + 1];
            }
        }
        liri();
    });
};

// Translates input
function getTranslation() {
    let translator = new Translator();
    // prompts whether user wants to translate to or from english
    inquirer
    .prompt({
        type: 'list',
        message: 'Translate:',
        choices: ['to English', 'from English'],
        name: 'languageChoice'
    }).then(reply => {
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
                // sets arguments for translate() to the input - gets WLT code for translation
                let langOne = 'en';
                let langTwo = translator.findLangCode(reply.language);
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
            ]).then(reply => {
                // sets arguments for translate() to the input - gets code for language to translate from
                let langOne = translator.findLangCode(reply.langOne);
                let langTwo = 'en';
                translator.translate(reply.text, langOne, langTwo);
            });
        }
    }); 
}