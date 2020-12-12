async function getMagnet(TorrentSearchApi, torrent) {
  const magnet = await TorrentSearchApi.getMagnet(torrent);
  return magnet;
}

module.exports = getMagnet;
