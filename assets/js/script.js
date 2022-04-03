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
    var sections;
    var sectionList;

    //List of sections to be displayed
    sectionList = {
        "Geography": "true",
        "History": "true",
        "Heritage listings": "true",
        "Education": "true",
    };

    searchQueryUrl = "https://en.wikipedia.org/w/api.php?&action=query&list=search&srlimit=1&format=json&origin=*&srsearch=" + searchString;

    //Nested fetches - first gets top search result for location entered. Second then gets sections of wiki page for location and parses it.
    fetch(searchQueryUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                //Capture API error and alert user NOTE: need CSS modal solution
                alert("Wikipedia API error: " + response.statusText);
                console.log(response);
                return;
            }
        })
        .then(function (data) {
            console.log("Top Wikipedia Search Page Found: " + data["query"]["search"][0]["title"]);
            pageTitle = data["query"]["search"][0]["title"];
            parseUrl = "https://en.wikipedia.org/w/api.php?&action=parse&prop=sections&format=json&origin=*&page=" + pageTitle;
            fetch(parseUrl)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        //Capture API error and alert user NOTE: need CSS modal solution
                        alert("Wikipedia API error: " + response.statusText);
                        console.log(response);
                        return;
                    }
                })
                .then(function (data) {
                    console.log("Wiki parsed data for the page " + pageTitle);

                    //Get array of content section objects
                    sections = data.parse.sections;
                    //------------------------
                    console.log(sections);
                    //------------------------
                    renderWikiSections(sections, sectionList, pageTitle);
                });
        });

}

//Render wiki sections to HTML. Wrapper CSS class = mw-parser-output
async function renderWikiSections(sections, sectionList, pageTitle) {
    var sectionId;

    //Loop through required sections and build html for main page
    for (var key in sections) {
        if (Object.hasOwnProperty.call(sections, key)) {

            if (sectionList[sections[key]['line']] === "true") {

                sectionId = parseInt(key) + 1;

                parseUrl = "https://en.wikipedia.org/w/api.php?&action=parse&section=" + sectionId + "&format=json&disablelimitreport=true&disableeditsection=true&disabletoc=true&origin=*&page=" + pageTitle;

                //Do wait on async fetch so sections get returned in order
                var response = await fetch(parseUrl);
                if (response.ok) {
                    var json = await response.json();
                } else {
                    //Capture API error and alert user NOTE: need CSS modal solution
                    alert("Wikipedia API error: " + response.statusText);
                    console.log(response);
                    return;
                }
                //------------------------
                console.log(json);
                //------------------------
                //Get section HTML, remove reference links
                wikiDom = $("<div>" + json.parse.text['*'] + "<div>");
                wikiDom.find('sup').remove();
                wikiDom.find('a').each(function () {
                    $(this)
                        .attr('href', 'http://en.wikipedia.org' + $(this).attr('href'));
                });
                //Render in HTML DOM
                wikiDiv.innerHTML = wikiDiv.innerHTML + wikiDom[0].innerHTML;
            }
        }
    }
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

