# liri-bot

## Summary
Liri-bot is a CLI app created in Node that takes in user input (musical artists, songs, and movie titles) and returns information about each of those inputs. 

Liri also translates to and from English for the following supported languages: Arabic, Czech, Danish, Dutch, Finnish, French, German, Hindi, Italian, Japanese, Korean, Norwegian Bokmal, Polish, Portuguese, Russian, Simplified Chinese, Spanish, Swedish, Traditional Chinese, Turkish

### Node packages used
dotenv, axios, moment, inquirer, colors, owl-wisdom, spotify-node-api, watson-developer-cloud

### APIs
BandsInTown, Spotify, OMDB, Watson Language Translator

### How to install
* Open terminal or git bash and clone this repository to the directory of your choice
* Enter ` npm install ` or ` npm i ` to install the node packages needed to run the app
* **Note:** A local .env file containing the credentials for the Spotify and Watson Language Translator APIs will need to be provided. Spotify id and secret can be obtained [here](https://developer.spotify.com/) and credentials for WLT are available through a free IBM Cloud account [here](https://www.ibm.com/watson/services/language-translator/).

### How to use
* Once you have the necessary files to run liri-bot, enter ` node liri `
* You'll see the following menu:

![liri-bot menu](gifs/menu.png)

* Select one of the items in the menu to get data from liri.

### concert-this
* Once selected, enter an artist and press ` enter `. If nothing is entered, liri will return concerts for Unknown Mortal Orchestra.
* Call to the BandsInTown API will return details about upcoming concerts such as: artist, venue, location (city, state within US; city, country outside US), local date/time, and a link to the event's page on bandsintown.com.

![liri-bot concert-this request](gifs/concert.gif)

### spotify-this-song
* Enter a song title and press ` enter `. If no song is entered, liri will return information about *No Scrubs* by TLC.
* Call to the Spotify API will return details about the song such as: title, artist, release date, album title, and a link to the song on Spotify.

![liri-bot spotify-this-song request](gifs/song.gif)

### movie-this
* Enter a movie title to search and press ` enter `. If no movie is entered, liri will return information about *Amélie*.
* Call to the OMDB API will return details about the movie such as: title, release date, IMDB and Rotten Tomatoes ratings, director, country (or countries) where it was produced, language(s), plot, and actors.

![liri-bot movie-this request](gifs/movie.gif)

### do-what-it-says
* When selected, this request returns details about either a movie, concerts, or a song. This defaults to the values held in random.txt.
* Liri chooses which request to run and what value to provide it by randomly generating a number representing that request's index in an array.
* This data is not affected by user input.

![liri-bot do-what-it-says request](gifs/random.gif)

### info-saved
* When run, this request re-prints all of the data (concerts, songs, movies, translations) that has previously been requested by the user. This does not include the data from do-what-it-says.

![liri-bot info-saved request](gifs/info.gif)

### get-random-quote
* Request provides a random owl quote from the owl-wisdom package.

![liri-bot get-random-quote request](gifs/quote.gif)

### translate-this
* Follow the prompts to select the language you wish to translate to and the text to be translated.
* Call to the Watson Language Translator API will return a translation of the input in the language selected. Due to the limitations presented by WLT in translating between non-English languages (ex: French to Danish), liri currently only supports direct translations to and from English.

To English

![liri-bot translate-this request to-english](gifs/to-english.gif)

From English

![liri-bot translate-this request from-english](gifs/from-english.gif)
