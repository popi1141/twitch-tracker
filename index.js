"use strict";

const url = "https://api.twitch.tv/helix/";
const client_id = "g6qhzis454gcc6y0side2g8t9yhi5s"
const ANIM_INTERVAL = 1000;

window.addEventListener("load", init);

function init() {
    grabGames();
    grabStreams();
}

/* Grab Top Games */
function grabGames() {
    fetch(url + 'games/top', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Client-ID': client_id,
        }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            createNav(responseJson.data)
        })
} 

/* Grab Top Streams */
function grabStreams() {
  fetch(url + 'streams', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Client-ID': client_id,
      }
      })
      .then((response) => response.json())
      .then((responseJson) => {
          createLanguageNav(responseJson.data);
      })
  } 

/* Puts Top Games Into the Navbar */
function createNav(games) {
    for (let gameCount = 0; gameCount < games.length; gameCount++) {
        let element = document.createElement("li");
        element.classList.add("nav-item");
        let content = document.createElement("a");
        content.classList.add("nav-link");
        content.innerText = games[gameCount].name;
        element.appendChild(content);
        content.addEventListener("click", () => selectGame(games[gameCount]));
        document.getElementById("games").appendChild(element);
    }
    selectGame(games[0]);
}

/* Puts Languages in the Navbar */
function createLanguageNav(streams) {
  var languages = [];
  for (let languageCount = 0; languageCount < streams.length; languageCount++) {
    let newLanguage = streams[languageCount].language;
    if(languages.indexOf(newLanguage) === -1) {
      languages.push(newLanguage);
      let element = document.createElement("li");
      element.classList.add("nav-item");
      let content = document.createElement("a");
      content.classList.add("nav-link");
      content.innerText = newLanguage;
      element.appendChild(content);
      content.addEventListener("click", () => selectLanguage(newLanguage));
      document.getElementById("languages").appendChild(element);
    }
  }
}

/* Behavior for Game Selection */
function selectGame(game) {
    document.getElementById("current-game").innerText = game.name;
    document.getElementById("current-game").name = game.id;
    grabTopStreamsofGame(game.id, document.getElementById("current-language").innerText);
}

/* Behavior for Game Selection */
function selectLanguage(language) {
  document.getElementById("current-language").innerText = language;
  grabTopStreamsofGame(document.getElementById("current-game").name, language);
}
  
/* Grab Top Streams of a Specific Game */
function grabTopStreamsofGame(game_id, language) {
console.log(url + 'streams?game_id=' + game_id + "&language=" + language);
fetch(url + 'streams?game_id=' + game_id + "&language=" + language, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Client-ID': client_id,
    }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        handleStreamList(responseJson.data);
        //console.log(responseJson.data);
    })
} 

/* Generates the Main View */ 
function handleStreamList(streams) {
    document.getElementById("main-container").innerHTML = "";
    for (let streamCount = 0; streamCount < streams.length; streamCount++) {
        let card = document.createElement("div");
        card.classList.add("card");
        /* Thumbnail */
        let thumbnail = generateThumbnail(streams[streamCount]);
        card.appendChild(thumbnail);
        /* Card Body */
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
            /* Header */ 
            let header = generateHeader(streams[streamCount]);
            cardBody.appendChild(header);
            /* Title */
            let titleText = generateTitleText(streams[streamCount]);
            cardBody.appendChild(titleText);
            /* Viewer Count */
            let viewerText = generateViewerText(streams[streamCount]);
            cardBody.appendChild(viewerText);
            /* Button */
            let button = generateButton(streams[streamCount]);
            cardBody.appendChild(button);
            
        /* Add Card Body to Card */
        card.appendChild(cardBody);
        /* Adds Card to Overall Body */
        document.getElementById("main-container").appendChild(card);
    }
  }

/* Generate Thumbnail */
function generateThumbnail(stream) {
    let thumbnail = document.createElement("img");
    thumbnail.classList.add("card-img-top")
    let thumbnailLink = stream.thumbnail_url
    var editedWidth = thumbnailLink.replace("{width}", "640");
    var editedHeight = editedWidth.replace("{height}", "360");
    thumbnail.src = editedHeight;
    return thumbnail;
}

/* Generate Header */
function generateHeader(stream) {
    let header = document.createElement("h5");
    header.classList.add("card-title");
    header.innerText = stream.user_name; 
    return header;
}

/* Generate Title Text */
function generateTitleText(stream) {
    let titleText = document.createElement("p");
    titleText.classList.add("card-text");
    titleText.classList.add("title-text")
    let titleContent = stream.title
    if (stream.title.length >= 12) {
        titleContent = stream.title.substring(0,12) + "[...]";
    } 
    titleText.textContent = "Title: " + titleContent;
    return titleText;
}

/* Generate Viewer Count Text */
function generateViewerText(stream) {
    let viewerText = document.createElement("p");
    viewerText.classList.add("card-text");
    viewerText.classList.add("viewer-text")
    viewerText.textContent = "Viewers: " + stream.viewer_count;
    return viewerText;
}

/* Generate Button */
function generateButton(stream) {
    let button = document.createElement("a");
    button.href = "https://twitch.tv./" + stream.user_name;
    button.target = "_blank";
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.textContent = "Watch Stream";
    return button;
}