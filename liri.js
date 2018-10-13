require("dotenv").config();

const keys = require("./keys.js");
const fs = require('fs');
const Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
const request = require("request");
let liriR = process.argv[2];
const moment = require("moment");
// let name = process.argv[3];

//console.log(keys);

if (liriR === 'spotify-this-song') {
    song = process.argv[3];

    //if no song is provided
    if(!song){
        song = "the-sign"
    }
    spotifyThis();

} else if (liriR === 'movie-this') {
   
    movieThis();

} else if (liriR === 'concert-this') {
    concertThis();
} else if (liriR === 'do-what-it-says') {

    doWhatItSays();
};


function doWhatItSays() {
 fs.readFile("random.txt", "utf8", (err,data) => {
     if(!err){
        
    dataSplit = data.split(",");
    //  console.log(dataSplit[1]);
      song = dataSplit[1];
      liriTwo = liriR;
     liriTwo = dataSplit[0];

         spotifyThis();


     } else{
         throw err;
     }
 });
}





// spotify this song
function spotifyThis() {
    

    spotify.search({
        type: 'track',
        query: song,
        limit: 10,
    }, function (err, data) {

        let SpotifyData = data.tracks.items;

        for (i = 0; i < SpotifyData.length; i++) {
           // console.log(SpotifyData[i])
       
        if (!err) {
            //test
            // console.log(data.tracks.items);
            
            let spotifyInfo =
                "------------------------------ SPOTIFY ------------------------------" + "\n" +
                "ARTIST/BAND: " + SpotifyData[i].artists[0].name + "\n" +
                "SONG TITLE: " + SpotifyData[i].name + "\n" +
                "ALBUM: " + SpotifyData[i].album.name + "\n" +
                "URL PREVIEW: " + SpotifyData[i].preview_url + "\n" +
                "---------------------------------------------------------------------"  + "\n"

            console.log(spotifyInfo);
            //append searches to the log.txt file
            fs.appendFile("log.txt", spotifyInfo, function (err) {
                if (err) {
                    return console.log("error: " + err);
                };
            });
        } else {
            console.log("error: " + err);
        };
    }
    });
}

// omdb
function movieThis() {

    let title = process.argv[3];

    //if no movie is provided
    if(!title){
        title = "Mr.Nobody";
    };

    let queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function (err, response, body) { //npm request omdb JSON 
        //test
        //console.log(body);
        let movieData = JSON.parse(body);
        //test
        //console.log(movieData);
        //console.log("----------------------------------------");
        //console.log(response.statusCode);
        //console.log("----------------------------------------");

        if (!err && response.statusCode === 200) {// if there is no error, and the file exists, pull info

            //create variable to hold info, and to create format that will be displayed to the console
            let movieDisplay =
                "------------------------------ MOVIE ------------------------------" + "\n" +
                "TITLE: " + movieData.Title + "\n" +
                "RELEASE: " + movieData.Year + "\n" +
                "RATING: " + movieData.imdbRating + "\n" +
                "ROTTEN TOMATOES RATING: " + movieData.Ratings[1].Value + "\n" +
                "PRODUCTION: " + movieData.Production + "\n" +
                "LANGUAGE: " + movieData.Language + "\n" +
                "PLOT: " + movieData.Plot + "\n" +
                "ACTORS: " + movieData.Actors + "\n" +
                "-------------------------------------------------------------------"  + "\n"

            //display to the terminal
            console.log(movieDisplay);
             //append searches to the log.txt file
             fs.appendFile("log.txt", movieDisplay, function (err) {
                if (err) {
                    return console.log("error: " + err);
                };
            });
        } else {
            //if there's an error, display to to the terminal
            console.log("error: " + err);

        }
    })
}

//bands in town
function concertThis() {
    let arg = process.argv[3];
    splitTitle = arg.split("-");
    title = splitTitle.join("%20");

    let bandsURL = "https://rest.bandsintown.com/artists/" + title + "/events?app_id=codingbootcamp";

    request(bandsURL, function (err, response, body) { //npm request bandsInTown info function
        let bands = JSON.parse(body); //parse the JSON file
           // console.log(body)
        for (i = 0; i < bands.length; i++) { //loop through bands JSON
            if (!err && response.statusCode === 200) { // if there is no error, and the file exists, pull info
                //create variable to hold info, and to create format that will be displayed to the console
                let dateTime = moment(bands[i].datetime).format('MMMM/DD/YYYY, h:mm:ss a')
                let bandsDetails =
                    "------------------------------ BANDS IN TOWN ------------------------------" + "\n" +
                    "ARTIST/BAND: " + bands[i].lineup[0] + "\n" +
                    "VENUE: " + bands[i].venue.name + ", " + bands[i].venue.city + ", " + bands[i].venue.region + " " + bands[i].venue.country + "\n" +
                    "DATE: " + dateTime + "\n" +
                    "---------------------------------------------------------------------------"  + "\n"
                //display to the terminal
               console.log(bandsDetails);
                 //append searches to the log.txt file
            fs.appendFile("log.txt", bandsDetails, function (err) {
                if (err) {
                    return console.log("error: " + err);
                };
            });
            } else {
                //if there's an error, display to to the terminal
                console.log("error: " + err);
            }
        }
    })
}

