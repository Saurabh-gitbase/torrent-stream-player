// Search '1080' in 'Movies' category and limit to 20 results
async function searchTorrent(TorrentSearchApi, name, category) {
  const torrents = await TorrentSearchApi.search(
    ["1337x", "Limetorrents"],
    `${name}`,
    `${category}`,
    20
  );
  return torrents;
}

module.exports = searchTorrent;
