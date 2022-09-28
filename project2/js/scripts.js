// 1 - On the window's load, look for -
window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;
    //Code for taking care of querying the dropdown menus from the API
    let seriesListURL = "https://www.amiiboapi.com/api/amiiboseries/";
    getAmiiboDropdown(seriesListURL);
    let gameSeriesURL = "https://www.amiiboapi.com/api/gameseries/"
    getGameSeriesDropdown(gameSeriesURL);
    //On click for one of my additional functions, a recent search button, can be used in case they need the most recent search
    document.querySelector('#prevSearch').onclick = retrievePreviousSearch;
};



// 2
let displayTerm = "";

//Defining the necesary fields
// getGameSeries("https://amiiboapi.com/api/amiiboseries/");

function searchButtonClicked() {
    //Creating the amiibo endpoint search, this pulls back all the amiibo information related to the API
    let AMIIBO_URL = "https://www.amiiboapi.com/api/amiibo/?";
    //(No key is needed so it won't be defined)
    let url = AMIIBO_URL
    //Getting the term for the page from the typed in value 
    let filterCount = 0;
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;
    //Trimming the white space off of the value
    term = term.trim();
    //Only adding onto the url if there is something to add
    if (term.length > 0) {
        url += "name=" + term;
        filterCount++;

    }
    //Querying amiibo data thru the api, if and only if the value is populated, adds to url
    let amiiboSeries = document.querySelector("#amiiboSeriesSelect").value;
    if (amiiboSeries != 'Enter in the Amiibo Series') {
        if (filterCount > 0) {
            url += "&";
        }
        url += "amiiboSeries=" + encodeURI(amiiboSeries);
        filterCount++;


    }
    //Querying game series data thru the api, if and only if the value is populated, adds to url
    let gameSeries = document.querySelector("#seriesSelect").value;
    if (gameSeries != 'Enter in the Game Series') {
        if (filterCount > 0) {
            url += "&";
        }
        url += "gameseries=" + encodeURI(gameSeries);
        filterCount++;

    }

    document.querySelector("#status").innerHTML = `<b>Searching for '${displayTerm}'</b>`;

    //Local storage key for saving the most recent search
    localStorage.setItem("lastURL", url);
    //Retrieving amiibo data
    getAmiibo(url);
}
//Function for retrieving the previous search from local storage
function retrievePreviousSearch() {
    let url = localStorage.getItem("lastURL");
    getAmiibo(url);
}

//Data Loaded function
//Upon further inspection, I realize this is specific to the gif finder's data search, so I should create more for what I specifically want to get for my Amiibo API
function getAmiibo(url) {
    //1
    let xhr = new XMLHttpRequest();
    //2
    xhr.onload = amiiboLoaded;
    //3
    xhr.onerror = dataError;
    //4
    
    xhr.open("GET", url);
    xhr.send();
}
//Function specific for populating the amiibo series dropdown menu instead of hard coding it in
function getAmiiboDropdown(url) {
    //1
    let xhr = new XMLHttpRequest();
    //2
    xhr.onload = amiiboListLoaded;
    //3
    xhr.onerror = dataError;
    //4
    xhr.open("GET", url);
    xhr.send();
}
//Function specific for populating the game series dropdown menu instead of hard coding it in
function getGameSeriesDropdown(url) {
    //1
    let xhr = new XMLHttpRequest();
    //2
    xhr.onload = gameSeriesListLoaded;
    //3
    xhr.onerror = dataError;
    //4
    xhr.open("GET", url);
    xhr.send();
}

//Function for loading the amiiboseries dropdown that will be called above
function amiiboListLoaded(e) {
    let xhr = e.target;
    //6
    //7
    //Most important line - turns server response into an object
    let obj = JSON.parse(xhr.responseText);
    let amiiboSeriesContent = document.querySelector("#amiiboSeriesSelect");
    let results = obj.amiibo;
    let opt = document.createElement('option');
    opt.text = 'Enter in the Amiibo Series';
    amiiboSeriesContent.add(opt);
    for (let i = 0; i < results.length; i++) {

        let opt = document.createElement("option");
        opt.text = results[i].name;
        amiiboSeriesContent.add(opt);
    }
}
//Function for loading the amiiboseries dropdown that will be called above
function gameSeriesListLoaded(e) {
    let xhr = e.target;
    //6
    //7

    //Most important line - turns server response into an object
    let obj = JSON.parse(xhr.responseText);
    let amiiboSeriesContent = document.querySelector("#seriesSelect");
    let results = obj.amiibo;
    //Creating an empty list and populating it
    let gameList = [];
    for (let i = 0; i < results.length; i++) {
        gameList[i] = results[i].name;
    }
    //Creating a set from the list above, as the data retrieved was repeated multiple times. Using a set to make sure all the entries are unique
    let gameSet = new Set(gameList);
    let uniqueList = Array.from(gameSet);
    //Adding options to the dropdown menus
    let opt = document.createElement('option');
    opt.text = 'Enter in the Game Series';
    amiiboSeriesContent.add(opt);
    for (let i = 0; i < uniqueList.length; i++) {

        let opt = document.createElement("option");
        opt.text = uniqueList[i];
        amiiboSeriesContent.add(opt);
    }
}
function amiiboLoaded(e) {
    //5

    let xhr = e.target;
    //6
    
    //7
    //Most important line - turns server response into an object
    let obj = JSON.parse(xhr.responseText);
    //8 - Error handling
    if ("code" in obj){
        if (obj.code == 404){
            let errorMessage = "<b>No amiibo found!</b>";
            document.querySelector("#status").innerHTML = errorMessage;
            return;

        }
    }
    if (!obj.amiibo || obj.amiibo.length == 0) {
        return;
    }
    //9
    
    let results = obj.amiibo;
    let bigString = "";
    
    //10 - For loop for getting each of the data that is being searched for and its needed information
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        //11 - Easily accessible image
        let image = result.image;

        //12 - Easily accessible url
        let url = result.url;
        let line = `<div class='result'> Character: ${result.character} || Game Series: ${result.gameSeries} <hr> <img src='${image}' title= '${result.character}' /> </div>`;

       
        
        bigString += line;
        // bigString += info;

    }
    document.querySelector("#search-results").innerHTML = bigString;
    //17
}

// Function for printing an error to the console
function dataError(e) {
    console.log("An error occurred");
}
