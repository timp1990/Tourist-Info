// Connect to HTML
var searchForm = document.getElementById('search-form');
var searchInput = document.getElementById('search-input');
var searchButton = document.getElementById('search-button');
var previousPlacesDiv = document.getElementById('previous-places-div');
var clearButton = document.getElementById('clear-button');
var mainContentDiv = document.getElementById('main-content-div');
var mapDiv = document.getElementById('map-div');
var wikiDiv = document.getElementById('wiki-div');

// Declare Global Variables ---------------------------------
var googleMapsAPIKey = 'AIzaSyAfRxs-L0IXBlCuWGVDzPZKwU8DNotcNTQ';
var defaultCityCoords = { lat: -25.344, lng: 131.036 };

// ----------------------------------------------------------

// Tim ------------------------------------------------------------
function googleAPI(event) {
    event.preventDefault();
    console.log(searchInput.value);
    // Get the latitude and longitude of the searchCity


    return;
}
function initMap() {
    // The location of thisCity
    var thisCity = defaultCityCoords;
    // The map, centered at thisCity
    var map = new google.maps.Map(mapDiv, {
        zoom: 4,
        center: thisCity,
    });
    // The marker, positioned at thisCity
    var marker = new google.maps.Marker({
        position: thisCity,
        map: map,
    });
}

searchButton.addEventListener('click', googleAPI);

// -------------------------------------------------------------

// Rob ------------------------------------------------------------
function wikiAPI(searchString) {
    var searchQueryUrl;

    //Test search string
    // searchString = "Noosa Heads";

    searchQueryUrl = "https://en.wikipedia.org/w/api.php?&action=query&list=search&srlimit=1&format=json&origin=*&srsearch=" + searchString;

    //Nested fetches - first gets top search result for location entered. Second then gets details of wiki page for location and parses it.
    fetch(searchQueryUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                //Capture API error and alert user
                alert("Wikipedia API error: " + response.statusText);
                console.log(response);
                return;
            }
        })
        .then(function (data) {
            console.log("Top Wikipedia Search Page Found: " + data["query"]["search"][0]["title"]);
            pageTile = data["query"]["search"][0]["title"];
            parseUrl = "https://en.wikipedia.org/w/api.php?&action=parse&format=json&origin=*&page=" + pageTile;
            fetch(parseUrl)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        //Capture API error and alert user
                        alert("Wikipedia API error: " + response.statusText);
                        console.log(response);
                        return;
                    }
                })
                .then(function (data) {
                    console.log("Wiki parsed data for the page " + pageTile);
                    console.log(data);
                });
        });

}
// -------------------------------------------------------------


// Andrew ------------------------------------------------------------
function display() {
    return;
}

// -------------------------------------------------------------

function init() {

    //Test wiki api - outputs to console log.
    wikiAPI("Noosa Heads");

    return;
}

init();

