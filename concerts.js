
var fs = require('fs');
var moment = require('moment');
var axios = require('axios');
require('colors');

function Concerts(input) {
    this.queryURL = '';
    this.getQueryURL = function(){
        this.queryURL = `https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`;

        // Conditional controls for if there is no user input
        if (!input) this.queryURL = `https://rest.bandsintown.com/artists/unknown+mortal+orchestra/events?app_id=codingbootcamp`;
    };
    // Calls to BandsInTown API, displays data, and appends data to log.txt
    this.axiosConcerts = function(){
        // axios call to BandsInTown API
        axios.get(this.queryURL)
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
                concertDetails.push(artist, headline, location, date, `${url}\n`);

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
}

module.exports = Concerts;