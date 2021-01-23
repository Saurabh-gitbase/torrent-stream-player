const express = require("express");
const suggest = require("suggestion");
const TorrentSearchApi = require("torrent-search-api");
const app = express();

app.use(express.json());

//To handle cors
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

const getMagnet = require("./getMagnet");

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

app.get("/", (req, res) => {
  res.send("Active");
});

app.post("/getmagnet", (req, res) => {
  const torrent = req.body;
  console.log(torrent);
  getMagnet(TorrentSearchApi, torrent).then((result) => res.send(result));
});

app.get("/suggest/:q", (req, res) => {
  const setResult = (a) => {
    res.send(a.slice(0, 5));
  };
  suggest(`${req.params.q}`, function (err, suggestions) {
    if (err) res.send([]);
    else setResult(suggestions);
  });
});

app.get("/search/:name", (req, res) => {
  console.log(req.params.name);
  TorrentSearchApi.search(req.params.name).then((result) => res.send(result));
});

var PORT = process.env.PORT || 8080;
app.listen(PORT);
