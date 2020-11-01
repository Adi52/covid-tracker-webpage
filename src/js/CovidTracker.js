import SearchBar from "./SearchBar";
import Map from "./map";
import DrawChart from "./DrawChart";


export default class CovidTracker {
    constructor() {
        this.drawChart = new DrawChart(0);

        this.searchBar = new SearchBar(this);
        this.map = new Map(this);

    }
}