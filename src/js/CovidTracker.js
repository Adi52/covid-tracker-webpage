import SearchBar from "./SearchBar";
import Map from "./map";
import DrawChart from "./DrawChart";
import GetCovidData from "./GetCovidData";


export default class CovidTracker {
    constructor() {
        // this.drawChart = new DrawChart();

        this.searchBar = new SearchBar(this);
        this.map = new Map(this);
        // this.getCovidData = new GetCovidData(this)
    //
    //     // Draw line chart with global data at start
    //     this.getCovidData.getDailyGlobalTimeline();
    //
    //     // Tiles
    //     this.tileDeaths = document.querySelector('.tile__deaths');
    //     this.tileConfirmed = document.querySelector('.tile__confirmed');
    //     this.tileActive = document.querySelector('.tile__active');
    //     this.tileRecovered = document.querySelector('.tile__recovered');
    //
    // }
    //
    // updateTiles(tilesData) {
    //     this.tileDeaths.textContent = tilesData['deaths'];
    //     this.tileConfirmed.textContent = tilesData['confirmed'];
    //     this.tileActive.textContent = tilesData['active'];
    //     this.tileRecovered.textContent = tilesData['recovered'];
    }
}