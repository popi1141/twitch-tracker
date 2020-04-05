/**
 * Name: Justin Banusing
 * Date: October 30, 2019
 * Section: CSE 154 AE
 * This is the Javascript file for my CP3 project, Find Your Film!.
 * It gives the project the interactivity it needs in order to function.
 */
"use strict";
(function() {
  const URL = "https://api.themoviedb.org/3";
  const API_KEY = "f02882c2d886134cf92c9e2187d14321";
  const MOVIE_PATH = "/discover/movie?language=en-US&sort_by=popularity.desc&page=1&api_key=";
  const IMG_PATH = "http://image.tmdb.org/t/p/w300/";
  const MAX_LENGTH = 400;
  const RESPONSE_MIN = 200;
  const RESPONSE_MAX = 300;

  /**
   * This function calls the init function when the page is loaded.
   */
  window.addEventListener("load", init);

  /**
   * This function initializes the web page by calling the functions it needs
   * to do so.
   */
  function init() {
    makeGuestSession();
    getGenreList();
    id("form").addEventListener("submit", function() {
      findMovie(id("search-bar").value);
    });
    id("title").addEventListener("click", function() {
      location.reload();
    });                                     
  }

  /**
   * This function creates a guest session for the current user.
   */
  function makeGuestSession() {
    const url = URL + "/authentication/guest_session/new?api_key=" + API_KEY;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .catch((error) => displayError(error, "Can't connect to the MovieDB API."));
  }

  /**
   * This function searches the films with titles nearest to the term set in the search bar.
   *  @param {String} searchTerm - term to search for
   */
  function findMovie(searchTerm) {
    const url = URL + "/search/movie?api_key=" + API_KEY + "&query=" + searchTerm;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then((json) => handleFilmList(json.results))
      .catch((error) => displayError(error, "Couldn't find movies with a similar list!"));
  }

  /**
   * This function gets all the valid genres in the MovieDB list.
   */
  function getGenreList() {
    const url = URL + "/genre/movie/list?language=en-US&api_key=" + API_KEY;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then((json) => createNav(json.genres))
      .catch((error) => displayError(error, "Genre List Can't Be Fetched!"));
  }

  /**
   * This function puts all the valid genres into the navbar.
   * @param {Object} genres - list of genres
   */
  function createNav(genres) {
    for (let genreCount = 0; genreCount < genres.length; genreCount++) {
      let element = document.createElement("li");
      element.classList.add("nav-item");
      let content = document.createElement("a");
      content.classList.add("nav-link");
      content.innerText = genres[genreCount].name;
      content.id = genres[genreCount].id;
      element.appendChild(content);
      content.addEventListener("click", () => selectGenre(genres[genreCount]));
      id("genres").appendChild(element);
    }
    selectGenre(genres[0]);
  }

  /**
   * This function is called whenever a genere is selected. It changes the highlighted
   * genere on the selection area, and calls the poster generator.
   * @param {Object} genre - list of genres.
   */
  function selectGenre(genre) {
    id("current-genre").innerText = genre.name;
    generateFilmList(genre.id);
  }

  /**
   * This function generates the top 20 films in the selected genre.
   * @param {String} genreId - the genre id based on the api.
   */
  function generateFilmList(genreId) {
    const url = URL + MOVIE_PATH + API_KEY + "&with_genres=" + genreId;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then((json) => handleFilmList(json.results))
      .catch((error) => displayError(error, "Cannot fetch movie list"));
  }

  /**
   * This function shows the top 20 films in the selected genre on the webpage.
   * @param {Object} films - film lists, containing film details
   */
  function handleFilmList(films) {
    id("poster-container").innerHTML = "";
    for (let filmCount = 0; filmCount < films.length; filmCount++) {
      let card = generateCard(films[filmCount]);
      id("poster-container").appendChild(card);
    }
  }

  /**
   * This function creates a card for a specific film, which includes the
   * movie poster and summary.
   * @param {Object} film - film lists, containing film details
   * @returns {Object} card - card of poster + summary
   */
  function generateCard(film) {
    let card = document.createElement("div");
    let cardContainer = document.createElement("div");
    card.classList.add("film-card");
    cardContainer.classList.add("film-card-inner");
    let cardFront = generateCardFront(film);
    let cardBack = generateCardBack(film);
    cardContainer.appendChild(cardFront);
    cardContainer.appendChild(cardBack);
    cardContainer.addEventListener("click", flipCard);
    card.appendChild(cardContainer);
    return card;
  }

  /**
   * This function generates the front of the card, which is a film's poster.
   * @param {Object} film - film lists, containing film details
   * @returns {Object} cardBack - back of card div.
   */
  function generateCardFront(film) {
    let cardFront = document.createElement("div");
    cardFront.classList.add("film-card-front");
    let poster = document.createElement("img");
    poster.src = IMG_PATH + film.poster_path;
    poster.alt = film.title;
    cardFront.appendChild(poster);
    return cardFront;
  }

  /**
   * This function generates the back of a card, which is a film's title & summary.
   * @param {Object} film - film lists, containing film details
   * @returns {Object} cardBack - back of card div.
   */
  function generateCardBack(film) {
    let cardBack = document.createElement("div");
    cardBack.classList.add("film-card-back");
    let backTitle = document.createElement("h3");
    let summary = document.createElement("p");
    let summaryText = film.overview;
    if (summaryText.length >= MAX_LENGTH) {
      summaryText = summaryText.substring(0, MAX_LENGTH) + "[...]";
    }
    summary.innerText = summaryText;
    backTitle.innerText = film.title;
    cardBack.append(backTitle);
    cardBack.append(summary);
    return cardBack;
  }

  /**
   *  Swaps a card with the back.
   */
  function flipCard() {
    this.classList.toggle("swapped");
  }

  /**
   * This function display error notification and its message in the
   * topmost section of the page.
   * @param {String} error - error text from http response
   * @param {String} type - a generic error description
   */
  function displayError(error, type) {
    id("error-message").classList.remove("hidden");
    id("error-message").innerText = error + " : " + type;
  }

  /* ------------------------------ Helper Functions ------------------------------ */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= RESPONSE_MIN && response.status < RESPONSE_MAX) {
      return response.text();
    }
    return Promise.reject(new Error(response.status + ": " + response.statusText));
  }
})();