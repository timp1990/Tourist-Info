// Connect to HTML
var searchForm = document.getElementById('search-form');
var previousForm = document.getElementById('previous-form');
var searchInput = document.getElementById('search-input');
var searchButton = document.getElementById('search-button');
var previousPlacesDiv = document.getElementById('previous-places-div');
var clearButton = document.getElementById('clear-button');
var mainContentDiv = document.getElementById('main-content-div');
var mapDiv = document.getElementById('map-div');
var wikiDiv = document.getElementById('wiki-div');
var preCityNameEl = document.getElementById('previous-places-div');
// Declare Global Variables ---------------------------------
var previousSearchesObj = { searchName: [] };
var googleMapsAPIKey = config.mapsKey;
var googleGeocodingAPIKey = config.geocodingKey;
var map;
var cityGoogleObject = {}; // Object has .lat, .long , .address and .touristAttractionsSearchURL variables
var defaultCityName = 'Sydney';
var defaultCityCoords = { lat: -33.8688, lng: 151.2093 }; //Alice Springs
// var defaultCityCoords = { lat: -25.344, lng: 131.036 }; //Aus Centre
var searchCity;

// ----------------------------------------------------------

// Tim ------------------------------------------------------------
function googleAPI(searchCity) {
    // Get the latitude and longitude of the searchCity

    if (searchCity === "" || searchCity === undefined) {
        searchCity = searchInput.value;
    }

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

    //Setup default map then call display to set local storage map
    defaultDisplay();
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
            saveSearch(cityForGeocode);

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

//searchButton.addEventListener('click', googleAPI);

// -------------------------------------------------------------

// Rob ------------------------------------------------------------
function wikiAPI(searchString) {
    var searchQueryUrl;
    var sections;
    var sectionList;

    //List of section types to be displayed
    sectionList = {
        "Geography": "",
        "Climate": "",
        "History": ""
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
                    console.log("Wiki sections found for page");
                    console.log(sections);
                    //------------------------
                    renderWikiSections(sections, sectionList, pageTitle);
                });
        });

}

//Render wiki sections to HTML. Wrapper CSS class = mw-parser-output
async function renderWikiSections(sections, sectionList, pageTitle) {
    var sectionId;
    var sectionText;
    var wikiDom;
    var delClimate = false;

    //Clear existing wiki info
    wikiDiv.innerHTML = "";

    //Get index values for required sections
    for (var key in sections) {
        if (Object.hasOwnProperty.call(sections, key)) {

            if (sectionList.hasOwnProperty(sections[key]['line'])) {
                sectionList[sections[key]['line']] = key;
                if (sections[key]['line'] === "Geography") {
                    delClimate = true;
                }
            }
        }
    }

    if (delClimate) {
        delete sectionList.Climate;
    }

    //Loop through required sections and build html for main page
    for (var key in sectionList) {
        if (Object.hasOwnProperty.call(sectionList, key)) {

            sectionId = parseInt(sectionList[key]) + 1;

            if (!isNaN(sectionId)) {
                parseUrl = "https://en.wikipedia.org/w/api.php?&action=parse&section=" + sectionId + "&prop=text&format=json&&disableeditsection=true&disablelimitreport=true&disabletoc=true&origin=*&page=" + pageTitle;

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
                //------------------------git 
                // console.log(json);
                // //------------------------
                //Get section HTML, remove image, sup and reference links
                sectionText = json.parse.text['*'].replace(/<img[^>]*>/g, "");
                sectionText = sectionText.replace(/<a[^>]*>/g, "");
                wikiDom = $("<div>" + sectionText + "</div>");
                wikiDom.find('sup').remove();
                wikiDom.find('.references').remove();
                //Render in HTML DOM
                wikiDiv.innerHTML = wikiDiv.innerHTML + wikiDom[0].innerHTML;
            }

        }
    }
    //Add link to Wikipedia page
    wikiDiv.innerHTML = wikiDiv.innerHTML + '<h4>See the full Wikipedia page<a href="https://en.wikipedia.org/wiki/' + pageTitle + '" target = "_blanc"> here</a></h2>'
}

// -------------------------------------------------------------
//searchButton.addEventListener('click', googleAPI); see Andrew's coding.

//--------------------------------------------------------------------------------------
// Andrew codes
// 1: Get local storege city to display or display default city
function defaultDisplay() {

    if (JSON.parse(localStorage.getItem('previousSearches')) != null) {
        var a = JSON.parse(localStorage.getItem('previousSearches'));
        var nameArr = a.searchName;
        searchCity = nameArr[0];

        //Call google maps and wiki APIs
        googleAPI(searchCity);
        wikiAPI(searchCity);

        previousDisplayRefresh();

    }

    else {
        //No stored searches so use default location
        googleAPI(defaultCityName);
        wikiAPI(defaultCityName);
    }
    return;
}

//1.1 Previous display Refresh
function previousDisplayRefresh() {

    if (JSON.parse(localStorage.getItem('previousSearches')) != null) {
        var a = JSON.parse(localStorage.getItem('previousSearches'));
        var nameArr = a.searchName;

        // Display all previous searches
        preCityNameEl.innerHTML = "";
        for (var index = 0; index < nameArr.length; index++) {
            previousCity = document.createElement('button');
            previousCity.textContent = nameArr[index];
            previousCity.setAttribute('class', 'bg-slate-400 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded block w-80 mb-2')
            previousCity.setAttribute('value', index)
            preCityNameEl.appendChild(previousCity);
        }

        return;
    }
}

//2: clear previous search name
clearButton.addEventListener('click', clearFunc)
function clearFunc(event) {
    event.preventDefault();
    preCityNameEl.innerHTML = "";
    localStorage.removeItem('previousSearches');
    return;

}

//3: Select previous searches from list
previousForm.addEventListener('click', select);
function select(event) {
    event.preventDefault();

    searchCity = event.target.textContent;
    googleAPI(searchCity);
    wikiAPI(searchCity);
}

//4: save current search to local storage
function saveSearch(searchCity) {
    //Check if local storage exists
    if (JSON.parse(localStorage.getItem('previousSearches')) != null) {
        var a = JSON.parse(localStorage.getItem('previousSearches'));
        //Check if city already saved
        if (a.searchName.indexOf(searchCity) < 0) {
            //Add city to local storage
            a.searchName.push(searchCity);
            localStorage.setItem('previousSearches', JSON.stringify(a));
        }
    } else {
        //No local storage yet so create and city
        previousSearchesObj.searchName.push(searchCity);
        localStorage.setItem('previousSearches', JSON.stringify(previousSearchesObj));
    }

    //Refresh previous searches display
    previousDisplayRefresh();

    return;
}

//5: To start a search
searchButton.addEventListener("click", startSearch)
function startSearch(event) {
    event.preventDefault();

    if (searchInput.value != "" && searchInput.value != undefined) {
        googleAPI(searchInput.value);
        wikiAPI(searchInput.value);
    }
    return;
}


// 6: init
function init() {
    // Setup Google maps section
    // Create the script tag, set the appropriate attributes for Initial Google Map. initMap function called.
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapsAPIKey + '&callback=initMap';
    script.async = true;
    document.head.appendChild(script);

    return;
}

init(); 
