
export default class GetCovidData {
    constructor(main) {
        this.main = main;
        // this.getDailyNewCasesTimeline(countryCode); // this will set auto

        this.chart = main.drawChart;
    }

    getDailyGlobalTimeline() {
        let dailyNewCasesDate = [];
        let dailyNewCasesCases = [];

        let tilesData = {
            'deaths': [],
            'confirmed': [],
            'active': [],
            'recovered': [],
        }

        fetch('https://corona-api.com/timeline')
            .then(response => {
                return response.json();
            })
            .then(data => {
                data['data'].forEach(covidInfo => {
                    dailyNewCasesDate.push(covidInfo['date'])
                    dailyNewCasesCases.push(covidInfo['new_confirmed'])
                })

                tilesData.deaths.push(data['data'][0]['deaths']);
                tilesData.confirmed.push(data['data'][0]['confirmed']);
                tilesData.active.push(data['data'][0]['active']);
                tilesData.recovered.push(data['data'][0]['recovered']);
            })
            .then(() => {
                this.callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases);
                this.main.updateTiles(tilesData);
            })
    }

    getDailyNewCasesTimeline(code) {
        let dailyNewCasesDate = [];
        let dailyNewCasesCases = [];

        let tilesData = {
            'deaths': [],
            'confirmed': [],
            'active': [],
            'recovered': [],
        }

        fetch(`https://corona-api.com/countries/${code}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                data['data']['timeline'].forEach(covidInfo => {
                    dailyNewCasesDate.push(covidInfo['date'])
                    dailyNewCasesCases.push(covidInfo['new_confirmed'])
                })

                let latest_data = data['data']['latest_data'];
                tilesData.deaths.push(latest_data['deaths']);
                tilesData.confirmed.push(latest_data['confirmed']);
                tilesData.active.push(latest_data['active']);
                tilesData.recovered.push(latest_data['recovered']);
            })
            .then(() => {
                this.callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases);
                this.main.updateTiles(tilesData);
            })

        // you must add spinner here later
    }



    callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases) {
        // dailyNewCasesDate.splice(0,1);
        // dailyNewCasesCases.splice(0,1);

        let covidInfo = {
            date: dailyNewCasesDate.reverse(),
            cases: dailyNewCasesCases.reverse()
        };

        // Remove active color from map;
        this.main.map.arrIsActiveElements.forEach(el => el.isActive = false);
        this.chart.drawChart(covidInfo);
    }

}