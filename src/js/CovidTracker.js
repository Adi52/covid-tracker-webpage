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


    }

    updateCountryNameAndFlag(code, tilesData) {
        let indexCountry = this.searchBar.countryCodes.indexOf(code);
        this.currentCountryFlag.src = this.searchBar.countryFlagsImg[indexCountry];
        this.currentCountryName.textContent = tilesData.country_name;
    }


    setColorOfRatio(ratio, tile) {
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
        this.tileDeaths.textContent = tilesData['deaths'];
        this.tileConfirmed.textContent = tilesData['confirmed'];
        this.tileActive.textContent = tilesData['active'];
        this.tileRecovered.textContent = tilesData['recovered'];

        this.tileDeathsRatio.textContent = this.calculateRatioToTiles(tilesData['deaths'], tilesData['new_deaths'], this.tileDeathsRatio);
        this.tileRecoveredRatio.textContent = this.calculateRatioToTiles(tilesData['recovered'], tilesData['new_recovered'], this.tileRecoveredRatio);
        this.tileConfirmedRatio.textContent = this.calculateRatioToTiles(tilesData['confirmed'], tilesData['new_confirmed'], this.tileConfirmedRatio);
    }
}