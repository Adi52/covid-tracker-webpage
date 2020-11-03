
export default class GetCovidData {
    constructor(main) {
        this.main = main;
        // this.getDailyNewCasesTimeline(countryCode); // this will set auto

        this.chart = main.drawChart;
    }

    getDailyGlobalTimeline() {
        let dailyNewCasesDate = [];
        let dailyNewCasesCases = [];

        fetch('https://corona-api.com/timeline')
            .then(response => {
                return response.json();
            })
            .then(data => {
                data['data'].forEach(covidInfo => {
                    dailyNewCasesDate.push(covidInfo['date'])
                    dailyNewCasesCases.push(covidInfo['new_confirmed'])
                })
            })
            .then(() => {
                this.callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases);
            })
    }

    getDailyNewCasesTimeline(code) {
        let dailyNewCasesDate = [];
        let dailyNewCasesCases = [];

        fetch(`https://corona-api.com/countries/${code}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                data['data']['timeline'].forEach(covidInfo => {
                    dailyNewCasesDate.push(covidInfo['date'])
                    dailyNewCasesCases.push(covidInfo['new_confirmed'])
                })
            })
            .then(() => {
                this.callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases);
            })
    }

    callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases) {
        // to trzeba będzie usunąć -> błędne dane w api na 01.11?
        dailyNewCasesDate.splice(0,1);
        dailyNewCasesCases.splice(0,1);


        let covidInfo = {
            date: dailyNewCasesDate.reverse(),
            cases: dailyNewCasesCases.reverse()
        };

        // Remove active color from map;
        this.main.map.arrIsActiveElements.forEach(el => el.isActive = false);
        this.chart.drawChart(covidInfo);
    }

}