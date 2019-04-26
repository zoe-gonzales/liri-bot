
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
require('colors');

class Concerts {
    constructor(input){
        this.input = input;
        this.queryURL = `https://rest.bandsintown.com/artists/${this.input}/events?app_id=codingbootcamp`;
    }

    axiosConcerts(){
        // axios call to BandsInTown API
        axios.get(this.queryURL)
        .then(response => {
            let concerts = response.data;
            console.log(`\nHere are some upcoming concerts for ${this.input}:\n`.magenta);
            
            concerts.map(concert => {
                let artist = concert.lineup[0];
                // Name of Venue
                let headline = `${artist} at ${concert.venue.name}`;
                // Venue location
                let location = '';
                // For locations in US
                if (concert.venue.region) location = `${concert.venue.city} ${concert.venue.region}`;
                // International locations do not provide a region, so using country instead
                else location = `${concert.venue.city}, ${concert.venue.country}`;
                // Date of the event (using Moment in MM/DD/YYYY format)
                let date = moment(concert.datetime).format('MMM D YYYY h:mm a');
                // Link to event on BandsInTown.com
                let url = concert.url;

                // Print to console.
                console.log(`${headline.green} \n Location: ${location.cyan} \n Date & Time (local): ${date.cyan} \n ${url.cyan}\n`);
                
                // Placing values into array for addition to log.txt
                const concertDetails = [];
                concertDetails.push(artist, headline, location, date, `${url}\n`);

                // adds output to log.txt
                fs.appendFile('text/log.txt', ', ' + concertDetails, err => {
                    if (err) console.log(err);
                });
            });
        })
        .catch(error => console.log(`Error: ${error}`)); 
    }
}

module.exports = Concerts;