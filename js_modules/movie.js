
var fs = require('fs');
var axios = require('axios');
require('colors');

// Calls to OMDB API, displays data, and appends data to log.txt
function Movie(input) {
    this.queryURL = '';
    this.validateQueryURL = function(){
        this.queryURL = `http://www.omdbapi.com/?apikey=trilogy&t=${input}`;
        // Conditional controls for if there is no user input
        if (!input) this.queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=am%C3%A9lie";
    };
    this.searchMovie = function(){
        // axios call to OMDB API
        axios.get(this.queryURL)
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
}

module.exports = Movie;