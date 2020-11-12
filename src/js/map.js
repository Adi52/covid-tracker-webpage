
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

export default class Map {
    constructor(main) {
        this.main = main;
        this.drawMap();

        this.arrIsActiveElements = [];
        this.chartLine = main.drawChart;
    }

    drawMap() {
        /* Create map instance */
        am4core.options.disableHoverOnTransform = "touch";

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

        this.polygonTemplate.tooltipHTML = `{name}`;
        // this.polygonSeries.tooltip.label.padding(50, 0, 0, 0);


        this.polygonTemplate.fill = am4core.color("#193363");
        this.polygonTemplate.stroke = am4core.color("#31445C");
        this.polygonTemplate.events.on("hit", (ev) => {
            ev.target.series.chart.zoomToMapObject(ev.target);
            let checkedCountryCode = ev.target.dataItem.dataContext.id;
            setTimeout(() => {
                ev.target.showTooltip();
                this.arrIsActiveElements.push(ev.target);
                ev.target.isActive = true;
            }, 1000);

            this.main.getCovidData.getDailyNewCasesTimeline(checkedCountryCode);
            // this.drawChart = new GetCovidData(this.checkedCountryCode, this.main);
        })

        /* Create hover state and set alternative fill color */
        let hs = this.polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#EC5469");


        let as = this.polygonTemplate.states.create("active");
        as.properties.fill = am4core.color("#EC5469");


        // Add Western European countries
        this.polygonSeries.exclude = ["AQ"];
        this.polygonSeries.calculateVisualCenter = true;

        this.chart.homeZoomLevel = 1.5;

        this.polygonTemplate.tooltipPosition = "fixed";

        this.polygonTemplate.tooltipX = this.polygonSeries.visualLatitude;
        this.polygonTemplate.tooltipY = this.polygonSeries.visualLongitude;

        this.chart.zoomControl = new am4maps.ZoomControl();

        this.chart.zoomControl.minusButton.background.fill = am4core.color("#193363");
        this.chart.zoomControl.plusButton.background.fill = am4core.color("#193363");

        this.chart.zoomControl.plusButton.background.states.getKey("hover").properties.fill = am4core.color("#31445C");
        this.chart.zoomControl.minusButton.background.states.getKey("hover").properties.fill = am4core.color("#31445C");

        // Preloader
        this.chart.events.on('ready', () => {
            let loader = document.querySelector('.preloader');
            loader.classList.remove('preloader--visible');
        })
    }
}

