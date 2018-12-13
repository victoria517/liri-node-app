require("dotenv").config();
var fs = require('fs');
var request = require('request');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var parameter = process.argv[3];

function switchCase() {
    switch (action) {
        case 'concert-this':
            bandsInTown(parameter);
            break;

        case 'spotify-this-song':
            spotifySong(parameter);
            break;

        case 'movie-this':
            movieInfo(parameter);
            break;

        case 'do-what-it-says':
            getRandom();
            break;

            default:
            logThis('Invalid Input');
            break;
    }
};

function bandsInTown(parameter) {
    if (action === 'concert-this') {
        var artist = '';
        for (var i = 3; i < process.argv.length; i++) {
            artist += process.argv[i];
        }
        console.log(artist);
    }
    else {
        artist = parameter;
    }
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request (queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var JS = JSON.parse(body);
            for (i = 0; i < JS.length; i++) {
                var dTime = JS[i].datetime;
                var month = dTime.substring(5,7);
                var year = dTime.substring(0,4);
                var day = dTime.substring(8,10);
                var dateForm = month + "/" + day + "/" + year;

              logThis("\n------------------------------------\n");

              logThis("Date: " + dateForm);
              logThis("Name: " + JS[i].venue.name);
              logThis("City: " + JS[i].venue.city);
              if (JS[i].venue.region !== " ") {
                  logThis("Country: " + JS[i].venue.region);
              }
                logThis("Country: " + JS[i].venue.country);
                logThis("\n----------------------------------------------------------\n");
            }
        }
    });
}
function spotifySong(parameter) {
    var searchTrack;
    if (parameter === undefined) {
        searchTrack = "The Sign ace of base";
    }
    else {
        searchTrack = parameter;
    }
    spotify.search({
        type: 'track',
        query: searchTrack
    }, function(error, data) {
        if (error) {
            logThis("Error: " + error);
            return;
        }
        else {
            logThis("\n--------------------------------------------------\n");
            logThis("Artist: " + data.tracks.items[0].artists[0].name);
            logThis("Song: " + data.tracks.items[0].name);
            logThis("Preview: " + data.tracks.items[3].preview_url);
            logThis("Album: " + data.tracks.items[0].album.name);
            logThis("\n--------------------------------------------------\n");
        }
    });
    };
    function movieInfo(parameter) {
        var findMovie;
        if (parameter === undefined) {
            findMovie = "Mr. Nobody";
        }
        else {
            findMovie = parameter;
        };

        var queryURL = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

        request(queryURL, function(err, res, body) {
            var bodyOf = JSON.parse(body);
        if (!err && res.statusCode === 200) {
            logThis("\n-------------------------------------------\n");
            logThis("Title: " + bodyOf.Title);
            logThis("Release Year: " + bodyOf.Year);
            logThis("IMDB Rating: " + bodyOf.imdbRating);
            logThis("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value);
            logThis("Country: " + bodyOf.Country);
            logThis("Language: " + bodyOf.Language);
            logThis("Plot: " + bodyOf.Plot);
            logThis("Actors: " + bodyOf.Actors);
            logThis("\n--------------------------------------------\n");
        }
        });
    };
    function getRandom() {
        fs.readFile('random.txt', "utf8", function(error, data) {
            if (error) {
                return logThis(error);
            }
        var dataArr = data.split(",");

        if (dataArr[0] === "spotify-this-song") {
            var songCheck = dataArr[1].trim().slice(1, -1);
            spotifySong(songCheck);
        }
        else if (dataArr[0] === "concert-this") {
            if (dataArr[1].charAt(1) === " ") {
                var dLength = dataArr[1].length - 1;
                var data = dataArr[1].substring(2,dLength);
                console.log(data);
                bandsInTown(data);
            }
            else {
                var bandName = dataArr[1].trim();
                console.log(bandName);
                bandsInTown(bandName);
            }
        }
        else if (dataArr[0] === "movie-this") {
            var movie_name = dataArr[1].trim().slice(1, -1);
            movieInfo(movie_name);
        }
        });
    };
    function logThis(dataToLog) {
        console.log(dataToLog);
        fs.appendFile('log.txt', dataToLog + '\n', function(err) {
            if (err) return logThis("Error logging data to file: " + err);
        });
    }
    switchCase();