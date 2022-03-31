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
function wikiAPI() {
    return;
}
// -------------------------------------------------------------


// Andrew ------------------------------------------------------------
function display() {
    return;
}

// -------------------------------------------------------------

function init() {
    return;
}

init();

