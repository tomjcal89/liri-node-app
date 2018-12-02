//start app

require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

//requireing spotify keys
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

//setting variables for the progress.argv
var query = process.argv;
var type = process.argv[2];
var array = [];

//loop through array of query
for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+")
}

array.splice(-1); 
var newArr = array.join("");


switch (type) {
    case 'concert-this':
        concert()
        break;
    case 'spotify-this-song':
        spotifySong()
        break;
    case 'movie-this':
        movie()
        break;
    case 'do-what-it-says':
        itSays()
        break;
}

// concert-this starting here
function concert() {
    // if nothing was entered then... 
    if (newArr === "") {
        console.log("------------------------------------------")
        console.log("No one entered. Please enter an Artists name.")
        console.log("------------------------------------------")
    } 
    // setting axios bands in town link
    else {
        axios.get("https://rest.bandsintown.com/artists/" + newArr + "/events?app_id=codingbootcamp").then(
        function (response) {
            // if no response from entered aritist
           if(response.data.length <= 0) {
                console.log("------------------------------------------")
               console.log("No info for this Artist")
               console.log("------------------------------------------")
           }
           //if there is a match then display the following information
           else {
            for(var i=0; i < response.data.length; i++) {
                
               console.log("------------------------------------------")
                console.log("Venue: " + response.data[i].venue.name)
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[0].venue.region)
                console.log("Event Date: " + moment(response.data[i].datetime).format('LL'))
                console.log("------------------------------------------")
            }
           }
           
        }
    );
    }

    
}
// spotify is starting here
function spotifySong() {
// if there is nothing entered, then do ace of base the sign
    if (newArr === "") {
        newArr = "ace+of+base+the+sign"
    }
//spotify search
    spotify.search({
        type: 'artist,track',
        query: newArr
    }, function (err, data) {
        //if an error occured
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //displaying the artist, track, preview and album
        console.log("------------------------------------------")
        console.log("Artist: " + data.tracks.items[0].artists[0].name)
        console.log("Track: " + data.tracks.items[0].name)
        console.log("Preview: " + data.tracks.items[0].preview_url)
        console.log("Album: " + data.tracks.items[0].album.name)
        console.log("------------------------------------------")
    });
}

//movie-this starts here
function movie() {
//if nothing was entered
    if (newArr === "") {
        newArr = "mr+nobody"
    }
//starting axios
    axios.get("http://www.omdbapi.com/?t=" + newArr + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            //console.loging title, year, ratings, country, language, plot, and actors
            console.log("------------------------------------------")
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatos Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("------------------------------------------")
           
        });
       
}

//do-what-it-says starts here

function itSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }
    
        var dataArr = data.split(",");
          
        newArr = dataArr[1];
        spotify()
      });
}

//logging data in log.txt file

var queryLog = query.splice(0,2)
queryLog =  "\n" + query.join(" ") + "\n"
console.log(queryLog)

fs.appendFile("log.txt", queryLog, function(err) {

    if (err) {
      console.log(err);
    } else {
      console.log("Log has been updated");
    }
  
  });

    