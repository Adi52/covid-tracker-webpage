
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
            'new_deaths' : [],
            'new_recovered' : [],
            'new_confirmed' : [],
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
                tilesData.new_deaths.push(data['data'][0]['new_deaths']);
                tilesData.new_recovered.push(data['data'][0]['new_recovered']);
                tilesData.new_confirmed.push(data['data'][0]['new_confirmed']);

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
            'country_name': [],
            'deaths': [],
            'confirmed': [],
            'active': [],
            'recovered': [],
            'new_deaths' : [],
            'new_recovered' : [],
            'new_confirmed' : [],
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
                let timeline = data['data']['timeline'][0];
                tilesData.country_name.push(data['data']['name']);

                tilesData.deaths.push(latest_data['deaths']);
                tilesData.confirmed.push(latest_data['confirmed']);
                tilesData.active.push(timeline['active']);
                tilesData.recovered.push(latest_data['recovered']);

                tilesData.new_deaths.push(timeline['new_deaths']);
                tilesData.new_recovered.push(timeline['new_recovered']);
                tilesData.new_confirmed.push(timeline['new_confirmed']);

            })
            .then(() => {
                this.main.updateCountryNameAndFlag(code, tilesData);
                this.callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases);
                this.main.updateTiles(tilesData);
                this.getNews(tilesData['country_name']);

            })
            .catch(() => {
                this.getNews('');
                this.main.noData(code);
            });
        // you must add spinner here later
    }

    getNews(countryName) {
        let link = `https://newsapi.org/v2/everything?language=en&q=covid+and+${countryName}%0D%0A&apiKey=a7bb7548ad4240a4a53a1671ddd253fe`;

        if (countryName === '') {
            // Get top headlines about covid
            link = 'https://newsapi.org/v2/top-headlines?q=covid&apiKey=a7bb7548ad4240a4a53a1671ddd253fe'
        }

        let news = [];

        fetch(link)
            .then(response => {
                return response.json();
            })
            .then(data => {
               let articles = data['articles'];
               for (let i = 0; i <= 4; i++) {
                   let article = {
                       'countryName': countryName,
                       'source': articles[i]['source']['name'],
                       'title': articles[i]['title'],
                       'url': articles[i]['url'],
                       'image': articles[i]['urlToImage'],
                       'date': articles[i]['publishedAt']
                   }
                   news.push(article);
               }

            })
            .then(() => {
                this.main.updateNews(news);
            })
            .catch((error) => console.log(error));
        //https://newsapi.org/v2/everything?language=en&q=covid+and+france%0D%0A&apiKey=fe50108c204c4630bd2f4cd277a76b67
    }

    callDrawLineChart(dailyNewCasesDate, dailyNewCasesCases) {
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