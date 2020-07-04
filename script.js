const apiKey = "28GCAbhMqv7TrBDJcXgb83K6ZH8z48hg6d4VwQLP";

const searchURL = "https://developer.nps.gov/api/v1/parks"

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function buildResultsHTML(responseJson) {
    let resultsHTML = '';
    for (let i = 0; i < responseJson.data.length; i++) {
        // set the current park to 'park' for readability
        let park = responseJson.data[i];
        // for each park result, we first add the full park name,
        // and a random image from the park
        resultsHTML +=`
        <li><h3>${park.fullName}</h3>
        <img src="${park.images[Math.floor(Math.random() * park.images.length)].url}" alt="${park.images[Math.floor(Math.random() * park.images.length)].altText}" class="resultsImg">`
        // then, we loop through the addresses and only add
        // the ones that have type:Physical
        for (let j = 0; j < park.addresses.length; j++){
            if (park.addresses[j].type === "Physical") {
                resultsHTML += `
                <address>
                ${park.addresses[j].line1}<br>
                ${park.addresses[j].city}, ${park.addresses[j].stateCode} ${park.addresses[j].postalCode}
                </address>`
            }
        }
        // then, we add the description and
        // a link to the NPS page
        resultsHTML +=`
        <p>${park.description}</p>
        <a href="${park.url}" target="_blank">Website</a>
        </li>`
    }
    return resultsHTML;
}

function displayResults (responseJson) {
    $('.js-results-list').empty();
    let resultsHTML = buildResultsHTML(responseJson);
    $('.js-results-list').html(resultsHTML);
    $('.js-results').removeClass('hidden');
}

function getParks(states, numResults) {
    const params = {
        stateCode: states,
        limit: numResults,
        api_key: apiKey,
    }
    // console.log(params);
    const queryString = formatQueryParams(params);
    // console.log(queryString);
    const url = searchURL + '?' + queryString;
    // console.log(url);
    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
    $('form').submit(e => {
        e.preventDefault();
        const states = $('#state').val().join();
        const numResults = $('#numResults').val();
        // console.log(states);
        // console.log(numResults);
        getParks(states, numResults);
    });
}

$(function() {
    // console.log("We're live! Waiting for input.");
    watchForm();
})