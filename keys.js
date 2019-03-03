

var spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

var translator = {
  version: process.env.IBM_VERSION,
  iam_apikey: process.env.IBM_API_KEY,
  url: process.env.IBM_URL
};

module.exports = {
  spotify: spotify,
  translator: translator
};