const express = require("express");
const app = express();

var path = require("path");

const TorrentSearchApi = require("torrent-search-api");

const searchTorrent = require("./torrentSearch");
const getMagnet = require("./getMagnet");

app.use(express.json());

// Working sites
// Default
TorrentSearchApi.enableProvider("1337x");
// Backup
TorrentSearchApi.enableProvider("Limetorrents");

// Categories
// [ 'All',
// 'Movies',
// 'TV',
// 'Anime',
// 'Xxx',
// 'Top100' ]


// To handle cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://stream-demo.netlify.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Active");
});

app.get("/search/:cat/:name", (req, res) => {
  searchTorrent(
    TorrentSearchApi,
    req.params.name,
    req.params.cat
  ).then((result) => res.send(result));
});

app.post("/getmagnet", (req, res) => {
  const torrent = req.body;
  getMagnet(TorrentSearchApi, torrent).then((result) => res.send(result));
});

var PORT = process.env.PORT || 8080;
app.listen(PORT);
