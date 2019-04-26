
const fs = require('fs');
const axios = require('axios');
require('colors');

class Movie {
    constructor(input){
        this.queryURL = `http://www.omdbapi.com/?apikey=trilogy&t=${input}`;
    }

    searchMovie(){
        // axios call to OMDB API
        axios.get(this.queryURL)
        .then(response => {

            let title = response.data.Title;
            let year = `Released in: ${response.data.Year}`;
            let director = `Directed by: ${response.data.Director}`;
            let imdb = `${response.data.Ratings[0].Source} rating: ${response.data.Ratings[0].Value}`;
            let rottenTomato = `${response.data.Ratings[1].Source} rating: ${response.data.Ratings[1].Value}`;
            let country = `Produced in: ${response.data.Country}`;
            let language = `Language(s): ${response.data.Language}`;
            let plot = `Plot: ${response.data.Plot}`;
            let actors = `Featuring: ${response.data.Actors}\n`;

            console.log(`\nHere are some details for ${title}:\n`.magenta);
            // Title
            console.log(`Movie title: ${title} \n${year} \n${director} \n${imdb} \n${rottenTomato} \n${country} \n${language} \n${plot} \n${actors}`.cyan);

            // Array to be added to log.txt
            const movieDetails = [title, year, director, imdb, rottenTomato, country, language, plot, actors];
            // adds output to log.txt
            fs.appendFile('text/log.txt', ',' + movieDetails, err => {
                if (err) console.log(err);
            });
        })
        .catch(err => console.log(`Error: ${err}`)); 
    }   
}

module.exports = Movie;