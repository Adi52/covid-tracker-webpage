
export default class SearchBar {
    constructor(main) {
        this.main = main;

        this.searchBar = document.querySelector('.search__input-country')
        this.ulCountries = document.querySelector('.search__countries ul')

        this.countryNames = [];
        this.countryCodes = [];
        this.countryFlagsImg = [];

        this.getCountries();
    }

    getCountries() {
        // get all countries to array (thanks it we can suggest country in search bar)
        fetch('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag')
            .then(response => {
                return response.json();
            })
            .then(countries => {
                countries.forEach(country => {
                    this.countryNames.push(country['name']);
                    this.countryCodes.push(country['alpha2Code']);
                    this.countryFlagsImg.push(country['flag']);
                });
            })
            .then(() => {
                this.searchBar.addEventListener('input', (e) => this.search(e));
            })
    }

    getData(code) {
        this.main.getCovidData.getDailyNewCasesTimeline(code);

        // zoom in map
        let countryCodeOnMap = this.main.map.polygonSeries.getPolygonById(code);
        this.main.map.chart.zoomToMapObject(countryCodeOnMap)

        // change bgcolor current country
        setTimeout(() => {
            this.main.map.arrIsActiveElements.push(countryCodeOnMap);
            countryCodeOnMap.isActive = true;
        }, 500);
    }

    search(e) {
        e.preventDefault();
        this.ulCountries.textContent = '';
        const searchText = e.target.value.toLowerCase();
        let countries = this.countryNames.filter(country => country.toLowerCase().includes(searchText));

        countries.forEach(country => {
            let index = this.countryNames.indexOf(country);
            const li = document.createElement('li');
            li.innerHTML = `<img src="${this.countryFlagsImg[index]}"> <p>${this.countryNames[index]}</p>`;
            this.ulCountries.appendChild(li);

            li.addEventListener('click', () => {
                this.getData(this.countryCodes[index]);
                this.ulCountries.textContent = '';
                e.target.value = '';
            })
        })


        if (searchText === '') {
            this.ulCountries.textContent = '';
        }
    }
}