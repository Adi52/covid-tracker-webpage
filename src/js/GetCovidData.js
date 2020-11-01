import DrawChart from "./DrawChart";

export default class GetCovidData {
    constructor() {
        // daily
        this.dailyNewCasesDate = [];
        this.dailyNewCasesCases = [];
        this.getDailyNewCasesFromDayOne('us'); // this will set auto
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
                this.dailyNewCasesDate.splice(0,1);
                this.dailyNewCasesCases.splice(0,1);
                // ^

                this.dailyNewCasesDate = this.dailyNewCasesDate.reverse();
                this.dailyNewCasesCases = this.dailyNewCasesCases.reverse();

                let dailyNewCases = {
                    date: this.dailyNewCasesDate,
                    cases: this.dailyNewCasesCases
                }

                let drawChart = new DrawChart(dailyNewCases);
            })
    }
}