const url = "http://localhost:3000/films/"
const filmsDiv = () => document.querySelector("#films")
const posterDiv = () => document.querySelector("#poster")
const showingDiv = () => document.querySelector("#showing")
let currentMovie = {}

document.addEventListener("DOMContentLoaded", () => {
    firstFetch();

    setupBuyTicketButton();
});

function firstFetch() {
    fetch(url + 1)
        .then(res => res.json())
        .then(spotlightMovie);
}

function spotlightMovie(movie) {
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

    // save movie object to currently spotlighted movie
    currentMovie = movie;
}

function setupBuyTicketButton() {
    // get button
    let button = document.querySelector(".button")

    // add event listener
    button.addEventListener("click", handleBuyTicket)
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
            // increment tickets sold and update DOM
            .then(res => res.json())
            .then(updatedMovie => {
                currentMovie = updatedMovie;
                spotlightMovie(currentMovie);
            });
    }
}