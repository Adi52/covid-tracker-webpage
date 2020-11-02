import * as am4core from "@amcharts/amcharts4/core";

export default class GetCovidData {
    constructor(countryCode, main) {
        this.main = main;
        // daily
        this.dailyNewCasesDate = [];
        this.dailyNewCasesCases = [];
        this.getDailyNewCasesFromDayOne(countryCode); // this will set auto

        this.chart = main.drawChart;
    }

    getDailyNewCasesFromDayOne(code) {
        fetch(`https://corona-api.com/countries/${code}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                data['data']['timeline'].forEach(covidInfo => {
                    this.dailyNewCasesDate.push(covidInfo['date'])
                    this.dailyNewCasesCases.push(covidInfo['new_confirmed'])

                })
            })
            .then(() => {
                // to trzeba będzie usunąć -> błędne dane w api na 01.11?
                // this.dailyNewCasesDate.splice(0,1);
                // this.dailyNewCasesCases.splice(0,1);
                // ^

                this.dailyNewCasesDate = this.dailyNewCasesDate.reverse();
                this.dailyNewCasesCases = this.dailyNewCasesCases.reverse();

                this.chart.covidInfo = {
                    date: this.dailyNewCasesDate,
                    cases: this.dailyNewCasesCases
                };

                if (this.chart.myChart !== undefined) this.chart.myChart.destroy();

                // Remove active color from map;
                this.main.map.arrIsActiveElements.forEach(el => el.isActive = false);

                this.chart.drawChart();
            })
    }
}