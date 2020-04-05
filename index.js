"use strict";

const url = "https://api.twitch.tv/helix/";
const client_id = "g6qhzis454gcc6y0side2g8t9yhi5s"
const ANIM_INTERVAL = 1000;

window.addEventListener("load", init);

$(document).ready(function() {
    setTimeout(function(){
        $('body').addClass('loaded');
    }, 1000);
});

function init() {
    grabGames();
}

/* Grabbing Template 
function grab() {
    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': client_id,
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson);
      })
  } */ 

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

/* Puts Top Games Into the Navbar */
function createNav(games) {
    for (let gameCount = 0; gameCount < games.length; gameCount++) {
        let element = document.createElement("li");
        element.classList.add("nav-item");
        let content = document.createElement("a");
        content.classList.add("nav-link");
        content.innerText = games[gameCount].name;
        content.id = games[gameCount].id;
        element.appendChild(content);
        content.addEventListener("click", () => selectGame(games[gameCount]));
        document.getElementById("games").appendChild(element);
    }
    selectGame(games[0]);
}

/* Behavior for Game Selection */
function selectGame(game) {
    document.getElementById("current-game").innerText = game.name;
    grabTopStreamsofGame(game.id);
}
  
/* Grab Top Streams of a Specific Game */
function grabTopStreamsofGame(game_id) {
fetch(url + 'streams?game_id=' + game_id, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Client-ID': client_id,
    }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        handleStreamList(responseJson.data);
    })
} 

/* Generates the Main View */ 
function handleStreamList(streams) {
    document.getElementById("main-container").innerHTML = "";
    for (let streamCount = 0; streamCount < streams.length; streamCount++) {
        console.log(streams[streamCount]);
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