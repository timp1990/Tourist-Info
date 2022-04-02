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
var googleMapsAPIKey = config.mapsKey;
var googleGeocodingAPIKey = config.geocodingKey;
var defaultCityCoords = { lat: -25.344, lng: 131.036 };
var map;
var cityGoogleObject = {}; // Object has .lat, .long , .address and .touristAttractionsSearchURL variables
var searchCity = '';

// ----------------------------------------------------------

// Tim ------------------------------------------------------------
function googleAPI(event) {
    event.preventDefault();
    // Get the latitude and longitude of the searchCity
    searchCity = searchInput.value;
    codeAddress(searchCity);
    var GoogleObject = cityGoogleInfo(searchCity);
}



function initMap() {
    // The location of thisCity
    var thisCity = defaultCityCoords;
    // The map, centered at thisCity
    map = new google.maps.Map(mapDiv, {
        zoom: 4,
        center: thisCity,
    });
    // The marker, positioned at thisCity
    var marker = new google.maps.Marker({
        position: thisCity,
        map: map,
    });


    // Let user get lat and long by double click on map
    map.addListener("dblclick", (mapsMouseEvent) => {
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(map);
    });
}

function codeAddress(cityForGeocode) {
    var address = cityForGeocode;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.zoom = 12;
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function cityGoogleInfo() {
    // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
    var latLongAPIRequest = "https://maps.googleapis.com/maps/api/geocode/json?address=" + searchCity + '&key=' + googleGeocodingAPIKey;

    fetch(latLongAPIRequest)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // This is where the data response is --- console.log(data)
            cityGoogleObject.lat = data.results[0].geometry.location.lat;
            cityGoogleObject.long = data.results[0].geometry.location.lng;
            cityGoogleObject.address = data.results[0].formatted_address;
            // https://www.google.com/search?q=places+to+visit+sydney&oq=places+to+visit+sydney&aqs=chrome.0.0i512l5j0i22i30l5.4916j0j7&sourceid=chrome&ie=UTF-8
            cityGoogleObject.touristAttractionsSearchURL = 'https://www.google.com/search?q=places+to+visit+sydney&oq=places+to+visit+' + searchCity + '&aqs=chrome.0.0i512l5j0i22i30l5.4916j0j7&sourceid=chrome&ie=UTF-8';
            console.log(cityGoogleObject.touristAttractionsSearchURL);
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
    // Setup Google maps section
    // Create the script tag, set the appropriate attributes for Initial Google Map
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapsAPIKey + '&callback=initMap';
    script.async = true;
    document.head.appendChild(script);
    return;
}

init();

