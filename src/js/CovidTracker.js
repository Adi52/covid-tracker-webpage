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
    }
}