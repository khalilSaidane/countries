// counntries div
const coutriesEl = document.getElementById('countries')
// search div
const searchBtn = document.getElementById('search-btn')
const searcEl = document.getElementById('search-input')
// detail div
const countryNameEl = document.getElementById('native-name')
const coutryCapitalEl = document.getElementById('capital')
const coutryPopulatinEl = document.getElementById('population')
const countryLanguagesEl = document.getElementById('languages')
const countryTimeZonesEl = document.getElementById('time-zones')
const countryCurrenciesEl = document.getElementById('currencies')
const countryBordersEl = document.getElementById('borders')
const countryFlagEl = document.getElementById('flag')

// Global variable that holds all the countries
// We need this for the empty search
var countries = []

const getContries = async () => {
    const resonse = await fetch('https://restcountries.eu/rest/v2/all');
    const countries = await resonse.json();

    return countries;

}

const displayCountries = (countries) => {
    coutriesEl.innerHTML = ''
    countries.forEach(country => {
        const countryEl = document.createElement('div');
        countryEl.innerHTML = `
        <li class="list-group-item country">
            <h4>${country.alpha2Code}</h4>
            <h2 class="country-name">${country.name}</h2>
        </li>
        `
        countryEl.addEventListener('click', (e) => {
            setCountryDetail(country)
            setSelecteditemToActive(countryEl.childNodes[1])
        })
        coutriesEl.appendChild(countryEl)

    });
    const countriesLiEl = document.querySelectorAll('.country');
    countriesLiEl[0].classList.add('active')
    //
    if (countries.length > 0) setCountryDetail(countries[0]);

}

searchBtn.addEventListener('click', (e) => search(), false);

const  setSelecteditemToActive = (liEL) => {
    // check if any element have a class active
    // if so then remove the class from it
    let getElemWithClass = document.querySelector('.active');
    if (getElemWithClass !== null) {
        getElemWithClass.classList.remove('active');
    }
    //add the active class to the element from which click event triggered
    liEL.classList.add('active')
}
// Search by country name. It can be the native name or partial name
async function search() {
    const value = searcEl.value;
    // If the imput is not empty make a call to the restcountries API
    // 
    if (value != '') {
        const resonse = await fetch('https://restcountries.eu/rest/v2/name/' + value);
        const countries = await resonse.json();
        if (countries.length> 0){
            displayCountries(countries);
        }else{
            coutriesEl.innerHTML = "No result matches your search."
        } 
    } else {
        displayCountries(countries)
    }
}

const setCountryDetail = (country) => {
    countryNameEl.innerHTML = country.nativeName;
    coutryCapitalEl.innerHTML = country.capital;
    coutryPopulatinEl.innerHTML = numberWithCommas(country.population);
    // Make sure all the uls are empty
    countryCurrenciesEl.innerHTML = '';
    countryTimeZonesEl.innerHTML = '';
    countryBordersEl.innerHTML = '';
    countryLanguagesEl.innerHTML = '';
    country.languages.forEach(language => {
        appendSpanEl(countryLanguagesEl, language.name);
    })
    country.currencies.forEach(currency => {
        appendSpanEl(countryCurrenciesEl, currency.name);
    })
    country.timezones.forEach(timezone => {
        appendSpanEl(countryTimeZonesEl, timezone)
    })
    country.borders.forEach(border => {
        // borders is a list of alpha3Code
        // we need to get the country name for every border
        borderCountry = countries.find(element => element.alpha3Code == border)
        appendSpanEl(countryBordersEl, borderCountry.name);
    })
    countryFlagEl.src = country.flag;
}

// Make big numbers more readble
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Append a span to ul
function appendSpanEl(ul, text) {
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(text));
    span.classList.add('badge', 'badge-secondary', 'mr-1');
    ul.appendChild(span)
}


// Initialize the document with all the countries
const init = async() => {
    countries = await getContries();
    displayCountries(countries);
}

init();