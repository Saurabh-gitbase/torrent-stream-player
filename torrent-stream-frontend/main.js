let torrents = [];
let category = "Movies";

function setCat(e) {
  category = e;
}

document.getElementById("search").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("searchval").value;
  loadingScreen();
  search(name);
  document.getElementById("searchval").value = "";
});

async function getMagnet(torrent) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  

  var raw = JSON.stringify(torrent);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://streamtorrent-demo.herokuapp.com/getMagnet/", requestOptions)
    .then((response) => response.text())
    .then((response) => player(response))
    .catch((error) => {
      console.log("error", error);
      errorDiv();
    });
}

const player = (magnet) => {
  const playerDiv = document.createElement("div");
  playerDiv.className = "webtor";
  playerDiv.id = "player";
  playerDiv.style.width = "100%";
  playerDiv.style.height = "100%";

  const modalBody = document.getElementById("player-body");
  modalBody.appendChild(playerDiv);

  window.webtor = window.webtor || [];
  window.webtor.push({
    id: "player",
    magnet: `${magnet}`,
    width: "100%",
    height: "100%",
    on: function (e) {
      var p = e.player;
      if (e.name == window.webtor.TORRENT_FETCHED) {
        console.log("Torrent fetched!");
      }
      if (e.name == window.webtor.TORRENT_ERROR) {
        console.log("Torrent error!");
      }
      if (e.name == window.webtor.INITED) {
        document
          .getElementById("pause")
          .addEventListener("click", function (ev) {
            p.pause();
          });
      }
    },
    poster: "",
  });
};

const play = (info) => {
  let index = Number(info.slice(6));
  getMagnet(torrents[index]);
};

function removePlayer() {
  document.getElementById("player").remove();
}

async function search(name) {
  torrents = [];
  magnetarr = [];
  var myHeaders = new Headers();

  

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  fetch(
    `https://streamtorrent-demo.herokuapp.com/search/${category}/${name}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      torrents = JSON.parse(result);
    })
    .then(() => {
      loadCard(torrents);
    })
    .catch((error) => {
      console.log("error", error);
      errorDiv();
    });
}

var loadCard = (torrentlist) => {
  const outerdiv = document.getElementById("outerdiv");

  if (torrentlist.length) {
    const cardBox = document.createElement("div");
    cardBox.className = "d-flex flex-wrap justify-content-around";
    for (let i = 0; i < torrentlist.length; i++) {
      const cardDetails = document.createElement("div");
      cardDetails.className = "card text-white m-3";
      cardDetails.style.backgroundColor = "#2c3531";
      cardDetails.style.width = "18rem";

      const cardsWrapper = document.createElement("div");
      cardsWrapper.className = "card-body";

      const cardh5 = document.createElement("h5");
      cardh5.className = "card-title";
      cardh5.innerHTML = `${torrentlist[i].title}`;

      const cardh7 = document.createElement("h7");
      cardh7.className = "card-subtitle mb-2 text-muted";
      cardh7.innerHTML = `${torrentlist[i].time}`;

      const cardh3 = document.createElement("h3");
      cardh3.className = "card-subtitle mb-2 text-white-50";
      cardh3.innerHTML = `${torrentlist[i].size}`;

      const cardh6 = document.createElement("h6");
      cardh6.className = "card-subtitle mb-2 text-muted text-danger";
      cardh6.innerHTML = `${torrentlist[i].provider}`;

      const cardIconDiv = document.createElement("div");
      cardIconDiv.className = "card-text flex";

      const uploadImg = document.createElement("img");
      uploadImg.className = "mr-2 w-7 h-7";
      uploadImg.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABmJLR0QA/wD/AP+gvaeTAAAE0UlEQVRoge2ZX2xTVRzHP7/b2w0oY4IkGOSB6JAHoNtsKQMyIyBETHTLMBg1WVgwJEKQFRLRtz0ZFViBRYgkyiTxhQ2iEKImEJQ/imyF0bLEZGqIDmUGgSKDjLb350PXZUpZe7vOYdLP073nnt/v9/3ec+49J/dCnjx58uTJM3rISCaffWbDFJxMEcsxDUCNeLdhOq+ESrf+MVI1c27IHfRXYmkNwvMgj6fupT+JyCHUOHjBu+1ULuvnzFBpm9+n8A7CEpuhpxHeDnkCJ3OhY9iGnj7eYF6fEHlfFf8w0ijQOPPn7s0tK1viw9EzLENzQm9NlL6+lixG5X5qjqqzcGXY/e717FNkiad9jTOK60tgcbY57sPJ28WxpT/OaOrLJtjItupddX1M7s0AVI6LOPZkG5zVCJUG62tU5UC2RTNBlerw3MDnduNsj1BJ1/pCVdliI6RHRepUpA7oyViYsLWka32hXX22DbluOFcBj2XY/ZLhiFeGPY3NYU9js+GIVwKXMglUKBl701lrV59tQwqvZNj1B8uSpzrKd3YlGzrKd3Y50QVAOJMEovqyXX22nqHyc29OjVvRX0l3I5R2pxjLg95tV1Nd9rRvmhxV6wsEb5qS8bhlTuv0bbmSqUZbIxSz7vrSxqicGBuPLbmfGYCgd9vV+Li+RQhH05R0OByxuXY02jJkYAz97CiHXVF99vuKppvJJk/7psmpjjtn7brl6uMFlMNDprQosaMx7ZTztG8ujll3p6lDp2DJOoSa1InkU5NbdUHvnmhCCeIO+reryPmwp7EZYE5w4ypRLQ95AvUImsi/xhlj/F5FX03tiIMY+oHEpcc0CrqD3vcitg0lirhWq1KLMI/0I7kr5ClejzRYkNjfXSu68RFIrYrU/cvQXtB9k/56aPXXixpiCdENhjsYaQLWpqljiXDGgk8KtHfvwM0bxD1C3e31T0ZxdSrsRpifzoygzSFvYF3SzPTjDWOuFUVaQYZ45UrttaJI6/TjDWMSpw1WyBtYJ2hzGkOGKgtE+TCK62LZ2fqyIQ3Nbtu0FOQkMCNN4kHajIEdw6zOteMnFEWOAFUZRFZNKIocmdW5dnyyQUUOZlwXnrAMOTWnzf/M4EYzeeBu2zATsVqAcTaSgrJ6/rf+Y71G7GHumAcAn43oxY47hcdKO/w1Zqz3ehR9zeZK4hJhf9n5N+Yl17sBQyrGToFiO9kAFK3uLeAGmCbZbXZ9GuOXKK4YSkEW8RMty7EDeI6kAHdwY4XAsiySJSlgGDv3/thszCRQlpe2+X3JRKD64jDEPBgYsgL6DUnibfa/RlUXQr8hVaaOrpycMBUG5r0O68PEg4BAHAYMyW+jKSYXqHAZkoZET4yqmhygyjfQbyguRguJb2O5x9KJyUNDmTQiNRLaW2HQsuwO+ltRVoxAscsIr2OJINZukJy/gBT2h72Bl2DQToForB7TXAg8kuN6j6IcQpSR+Deg8LthsjF5PrC6hyqaukWpAv7MedWR46rDsqoulAUuJxv+sV25MDdw1sKch/Ldf6/NNqeJO3wdvh1tgxtTzwFFSs/5q1GpVXQZdnfgI8dtha9A94W92z9L1SGjST3w4wrTmVt9maHEokTpuVixI+MPlXny5MmTJ0+ePPfyNwHKp1K6rFO2AAAAAElFTkSuQmCC";
      uploadImg.alt = "seeds";

      const sinfo = document.createElement("span");
      sinfo.innerHTML = `${torrentlist[i].seeds}`;

      const downloadImg = document.createElement("img");
      downloadImg.className = "mx-2 h-3 w-3";
      downloadImg.style.width = "52px";
      downloadImg.style.height = "52px";
      downloadImg.src =
        "data:image/png;base64,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";
      downloadImg.alt = "leeches";

      const linfo = document.createElement("span");
      linfo.innerHTML = `${torrentlist[i].peers}`;

      const playButton = document.createElement("button");
      playButton.type = "button";
      playButton.className = "btn btn-outline-success my-2";
      playButton.innerHTML = "Play";

      playButton.value = `player${i}`;
      playButton.setAttribute("data-toggle", "modal");
      playButton.setAttribute("data-target", "#largeModal");
      playButton.setAttribute("onclick", "play(this.value)");

      cardsWrapper.appendChild(cardh5);
      cardsWrapper.appendChild(cardh7);
      cardsWrapper.appendChild(cardh3);
      cardsWrapper.appendChild(cardh6);
      cardIconDiv.appendChild(uploadImg);
      cardIconDiv.appendChild(sinfo);
      cardIconDiv.appendChild(downloadImg);
      cardIconDiv.appendChild(linfo);
      cardsWrapper.appendChild(cardIconDiv);
      cardsWrapper.appendChild(playButton);
      cardDetails.appendChild(cardsWrapper);
      cardBox.appendChild(cardDetails);
    }
    removeLoading();
    outerdiv.appendChild(cardBox);
  } else {
    errorDiv();
  }
};

function errorDiv() {
  const outerdiv = document.getElementById("outerdiv");
  outerdiv.removeChild(outerdiv.firstElementChild);
  const errorCard = document.createElement("div");
  errorCard.className = "jumbotron jumbotron-fluid";
  errorCard.style.backgroundColor = "rgb(58, 59, 60)";
  const innerdiv = document.createElement("div");
  innerdiv.className = "container text-center";
  const innerh1 = document.createElement("h1");
  innerh1.className = "error-font";
  innerh1.innerHTML = "404!";
  const image = document.createElement("img");
  image.src = "./3.gif";
  image.alt = "404";
  image.className = "center";

  innerdiv.appendChild(innerh1);
  errorCard.appendChild(innerdiv);
  errorCard.appendChild(image);
  outerdiv.appendChild(errorCard);
}

function loadingScreen() {
  const outerdiv = document.getElementById("outerdiv");
  outerdiv.removeChild(outerdiv.firstElementChild);

  const loading = document.createElement("img");
  loading.src = "./2.gif";
  loading.alt = "loading GIF";
  loading.className = "center";

  outerdiv.appendChild(loading);
}

function homeScreen() {
  const outerdiv = document.getElementById("outerdiv");
  outerdiv.removeChild(outerdiv.firstElementChild);

  const home = document.createElement("img");
  home.src = "./1.gif";
  home.alt = "home GIF";
  home.className = "center";

  outerdiv.appendChild(home);
}

function removeLoading() {
  const outerdiv = document.getElementById("outerdiv");
  outerdiv.removeChild(outerdiv.firstElementChild);
}
