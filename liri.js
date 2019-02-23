
require("dotenv").config();

// Saved keys
var keys = require("./keys.js");

// Spotify key
var spotify = new Spotify(keys.spotify);