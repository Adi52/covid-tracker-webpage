import '../scss/app.scss';

/* Your JS Code goes here */

/* Demo JS */
import './demo.js';
import SearchBar from "./SearchBar";
import GetCovidData from "./GetCovidData";




import Map from "./map";
import DrawChart from "./DrawChart";

let drawChart = new DrawChart(0);

// -------------------------------------------

let searchBar = new SearchBar();

// let getCovidData = new GetCovidData('us');

let map = new Map(drawChart);



// Może być przydatne do kolorowania kraju
// import * as am4core from "@amcharts/amcharts4/core";
// map.polygonSeries.data = [{
//     "id": "US",
//     "name": "United States",
//     "value": 100,
//     "fill": am4core.color("#F05C5C")
// }]
//
// map.polygonTemplate.propertyFields.fill = "fill";