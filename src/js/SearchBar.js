

export default class SearchBar {
    constructor() {
        this.searchBar = document.querySelector('.input-country')
        this.ulCountries = document.querySelector('.countries ul')

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

    search(e) {
        e.preventDefault();
        this.ulCountries.textContent = '';
        const searchText = e.target.value.toLowerCase();

        let countries = this.countryNames.filter(country => country.toLowerCase().includes(searchText));

        countries.forEach(country => {
            let index = this.countryNames.indexOf(country);

            const li = document.createElement('li');

            li.innerHTML = `<img src="${this.countryFlagsImg[index]}"> <p>${this.countryNames[index]}, ${this.countryCodes[index]}</p>`;
            this.ulCountries.appendChild(li);
        })


        if (searchText === '') {
            this.ulCountries.textContent = '';
        }
    }
}