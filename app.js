require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
	.catch((error) =>
		console.log("Something went wrong when retrieving an access token", error)
	);

// Our routes go here:
app.get("/", (req, res) => {
	res.render("index");
});

app.get("/artist-search", async (req, res) => {
	//console.log(req.query);

	try {
		const searchingArtist = await spotifyApi.searchArtists(
			req.query.searchTerm
		);
		//console.log(
		//	"The received data from the API: ",
		//	searchingArtist.body.artists.items
		//);
		// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
		res.render("artist-search-results", {
			foundArtists: searchingArtist.body.artists.items,
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/albums/:artistId", async (req, res, next) => {
	const { artistId } = req.params;
	try {
		const albums = await spotifyApi.getArtistAlbums(artistId);
		console.log(albums);
		res.render("albums", albums);
	} catch (error) {
		console.log(error);
	}
});

app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
