
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import GetCovidData from "./GetCovidData";


export default class Map {
    constructor(main) {
        this.main = main;

        this.drawMap();
        this.checkedCountryCode = '';

        // this.chartLine = main.drawChart;
    }

    drawMap() {
        /* Create map instance */
        this.chart = am4core.create("chartdiv", am4maps.MapChart);

        /* Set map definition */
        this.chart.geodata = am4geodata_worldLow;

        /* Set projection */
        this.chart.projection = new am4maps.projections.Miller();

        /* Create map polygon series */
        this.polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

        /* Make map load polygon (like country names) data from GeoJSON */
        this.polygonSeries.useGeodata = true;

        /* Configure series */
        this.polygonTemplate = this.polygonSeries.mapPolygons.template;
        this.polygonTemplate.tooltipText = "{name}";
        this.polygonTemplate.fill = am4core.color("rgb(37,174,255)");
        this.polygonTemplate.events.on("hit", (ev) => {
            ev.target.series.chart.zoomToMapObject(ev.target);
            this.checkedCountryCode = ev.target.dataItem.dataContext.id;

            this.drawChart = new GetCovidData(this.checkedCountryCode, this.main);
        })

        /* Create hover state and set alternative fill color */
        var hs = this.polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("grey");


        // Add Western European countries
        this.polygonSeries.exclude = ["AQ"];

        this.chart.zoomControl = new am4maps.ZoomControl()
    }
}



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