import SearchBar from "./SearchBar";
import Map from "./map";
import DrawChart from "./DrawChart";
import GetCovidData from "./GetCovidData";


export default class CovidTracker {
    constructor() {
        this.drawChart = new DrawChart();

        this.searchBar = new SearchBar(this);
        this.map = new Map(this);
        this.getCovidData = new GetCovidData(this)

        // Draw line chart with global data at start
        this.getCovidData.getDailyGlobalTimeline();

        this.currentCountryName = document.querySelector('.data__current-country__name');
        this.currentCountryFlag = document.querySelector('.data__current-country__image');

        // Tiles
        this.tileDeaths = document.querySelector('.tile__left-data__cases.deaths');
        this.tileDeathsRatio = document.querySelector('.tile__right-data__difference.deaths');

        this.tileConfirmed = document.querySelector('.tile__left-data__cases.confirmed');
        this.tileConfirmedRatio = document.querySelector('.tile__right-data__difference.confirmed');

        this.tileActive = document.querySelector('.tile__left-data__cases.active');

        this.tileRecovered = document.querySelector('.tile__left-data__cases.recovered');
        this.tileRecoveredRatio = document.querySelector('.tile__right-data__difference.recovered');

        this.dataIcons = document.querySelectorAll('.tile__right-data__icon');
    }

    // getCountryName(code) {
    //     let indexCode = this.searchBar.countryCodes.indexOf(code);
    //     return this.searchBar.countryNames[indexCode];
    // }

    noData(code) {
        this.updateCountryNameAndFlag(code, false);
        this.getCovidData.callDrawLineChart([0], [0]);
        this.updateTiles(false);
        this.dataIcons.forEach(icon => {
            icon.style.display = 'none'
        });
    }

    updateCountryNameAndFlag(code, tilesData) {
        let indexCountry = this.searchBar.countryCodes.indexOf(code);
        this.currentCountryFlag.src = this.searchBar.countryFlagsImg[indexCountry];
        if (!tilesData) {
            this.currentCountryName.textContent = this.searchBar.countryNames[indexCountry];
        } else {
            this.currentCountryName.textContent = tilesData.country_name;
        }

    }

    setColorOfRatio(ratio, tile) {
        this.dataIcons.forEach(icon => icon.style.display = 'block');
        if (tile === this.tileRecoveredRatio) {
            if (ratio >= 0.2) {
                tile.parentNode.style.color = 'green';
            } else if (ratio < 0.2 && ratio > 0) {
                tile.parentNode.style.color = 'grey';
            } else {
                tile.parentNode.style.color = 'red';
            }
        } else {
            if (ratio >= 0.2) {
                tile.parentNode.style.color = 'red';
            } else if (ratio < 0.2 && ratio > 0) {
                tile.parentNode.style.color = 'grey';
            } else {
                tile.parentNode.style.color = 'green';
            }
        }

    }

    calculateRatioToTiles(oldCases, newCases, tile) {
        //oldCases - in api is summed with newCases
        let currentCases = oldCases - newCases;
        let ratio = 0;
        if (currentCases !== 0) {
            // don't let divide by zero
            ratio = oldCases * 100 / currentCases - 100;
        }

        this.setColorOfRatio(ratio, tile);

        return ratio.toFixed(2) + '%';
    }

    updateTiles(tilesData) {
        if (!tilesData) {
            this.tileDeaths.textContent = 'No data';
            this.tileConfirmed.textContent = 'No data';
            this.tileActive.textContent = 'No data';
            this.tileRecovered.textContent = 'No data';

            this.tileDeathsRatio.textContent = '';
            this.tileRecoveredRatio.textContent = '';
            this.tileConfirmedRatio.textContent = '';
        } else {
            this.tileDeaths.textContent = tilesData['deaths'];
            this.tileConfirmed.textContent = tilesData['confirmed'];
            this.tileActive.textContent = tilesData['active'];
            this.tileRecovered.textContent = tilesData['recovered'];

            this.tileDeathsRatio.textContent = this.calculateRatioToTiles(tilesData['deaths'], tilesData['new_deaths'], this.tileDeathsRatio);
            this.tileRecoveredRatio.textContent = this.calculateRatioToTiles(tilesData['recovered'], tilesData['new_recovered'], this.tileRecoveredRatio);
            this.tileConfirmedRatio.textContent = this.calculateRatioToTiles(tilesData['confirmed'], tilesData['new_confirmed'], this.tileConfirmedRatio);
        }
    }
}

//covid news api:
//https://newsapi.org/v2/top-headlines?country=us&q=covid&apiKey=fe50108c204c4630bd2f4cd277a76b67