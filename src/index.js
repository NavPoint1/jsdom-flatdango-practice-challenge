const url = "http://localhost:3000/films/"
const filmsDiv = () => document.querySelector("#films")
const posterDiv = () => document.querySelector("#poster")
const showingDiv = () => document.querySelector("#showing")
let currentMovie = {}
let buyButton = {}

document.addEventListener("DOMContentLoaded", () => {
    buyButton = document.querySelector(".button");
    firstFetches();
    initializeBuyTicketButton();
});

function firstFetches() {
    fetch(url + 1)
        .then(res => res.json())
        .then(spotlightMovie);

    fetch(url)
        .then(res => res.json())
        .then(renderMovieIndex);
}

function spotlightMovie(movie) {
    // save movie object to currently spotlighted movie
    currentMovie = movie;

    // get #poster
    // change #poster's src to movie's poster attribute
    posterDiv().src = movie.poster;

    // get #title
    let title = document.querySelector("#title");
    // get #runtime
    let runtime = document.querySelector("#runtime");
    // get #film-info
    let description = document.querySelector("#film-info");
    // get #showtime
    let showtime = document.querySelector("#showtime");
    // get #ticket-num
    let remainingTickets = document.querySelector("#ticket-num");

    // fill inner text
    title.innerText = movie.title;
    runtime.innerText = movie.runtime;
    description.innerText = movie.description;
    showtime.innerText = movie.showtime;
    remainingTickets.innerText = movie.capacity - movie.tickets_sold;

    // check buy button status
    checkButton();
}

function initializeBuyTicketButton() {
    // add event listener to buy button
    buyButton.addEventListener("click", handleBuyTicket);
}

function handleBuyTicket() {
    // if tickets remaining > 0 ...
    if(currentMovie.capacity - currentMovie.tickets_sold > 0) {
        // add ticket sale to database
        fetch(url + currentMovie.id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tickets_sold: currentMovie.tickets_sold + 1 })
        })
            // on successful database exchange,
            .then(res => res.json())
            // increment tickets sold, update ticket count on DOM
            .then(updatedMovie => {
                currentMovie = updatedMovie;
                spotlightMovie(currentMovie);
                // fix button status
                checkButton();
            });
    }
}

function checkButton() {
    if(currentMovie.tickets_sold == currentMovie.capacity) {
        buyButton.classList.remove("orange");
        buyButton.innerText = "Sold Out";
    }
    else if(buyButton.innerText == "Sold Out") {
        buyButton.classList.add("orange");
        buyButton.innerText = "Buy Ticket";
    }
}

function renderMovieIndex(movies) {
    // get films div
    let index = document.querySelector("#films");
    // clear its children
    index.innerHTML = "";

    // for each movie, make a new div
    movies.forEach(movie => renderIndexItem(movie, index));
}

function renderIndexItem(movie, index) {
    // create div
    let div = document.createElement("div");
    // attach to parent
    index.append(div);
    // set inner text to movie title
    div.innerText = movie.title.toUpperCase();
    // style div
    div.classList.add("film", "item");
    // style movie text if sold out
    if(movie.tickets_sold == movie.capacity) {
        div.classList.add("sold-out");
    }
    // add event listener
    div.addEventListener("click", () => {

        spotlightMovie(movie);
    })
}