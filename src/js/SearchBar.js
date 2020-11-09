
export default class SearchBar {
    constructor(main) {
        this.main = main;

        this.searchBar = document.querySelector('.search__bar--input')
        this.ulCountries = document.querySelector('.search__countries ul')

        this.countryNames = [];
        this.countryCodes = [];
        this.countryFlagsImg = [];

        this.getCountries();

        window.addEventListener('click', (e) => {
            // check if clicked outside .search
            if (!document.querySelector('.search').contains(e.target)) {
                this.resetUlList();
            }
        })
    }



    getCountries() {
        // get all countries to array (thanks it we can suggest country in search bar)
        fetch('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag')
            .then(response => {
                return response.json();
            })
            .then(countries => {
                countries.forEach(country => {
                    if (country['alpha2Code'] )
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

    shortenString(index) {
        if (this.countryNames[index].includes("(")) {
            let i = this.countryNames[index].indexOf('(');
            this.countryNames[index] = this.countryNames[index].substring(0, i);
        } else if (this.countryNames[index].includes(",")) {
            let i = this.countryNames[index].indexOf(',');
            this.countryNames[index] = this.countryNames[index].substring(0, i);
        } else if (this.countryNames[index].length > 20) {
            this.countryNames[index] = this.countryNames[index].substring(0, 20) + '...';
        }
    }

    createAndDefineLi(country, e) {
        let index = this.countryNames.indexOf(country);
        const li = document.createElement('li');
        this.shortenString(index);

        li.innerHTML = `<img src="${this.countryFlagsImg[index]}"> <p>${this.countryNames[index]}</p>`;
        this.ulCountries.appendChild(li);

        li.addEventListener('click', () => {
            this.getData(this.countryCodes[index]);
            this.ulCountries.textContent = '';
            e.target.value = this.countryNames[index];
        })
    }

    resetUlList() {
        this.ulCountries.textContent = '';
        this.searchBar.style.borderRadius = '20px';
    }

    search(e) {
        e.preventDefault();
        this.ulCountries.textContent = '';
        const searchText = e.target.value.toLowerCase();

        let countries = this.countryNames.filter(country => country.toLowerCase().includes(searchText));

        countries.forEach(country => {
            this.createAndDefineLi(country, e);
            this.searchBar.style.borderRadius = '20px 20px 0 0';
        })

        if (this.ulCountries.getElementsByTagName("li").length === 0 || searchText === '') {
            this.resetUlList();
        }
    }
}