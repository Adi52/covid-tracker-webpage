
export default class GetCovidData {
    constructor(main) {
        this.main = main;
        // this.getDailyNewCasesTimeline(countryCode); // this will set auto

        this.chart = main.drawChart;
        this.tilesLoader = document.querySelector('.data__tiles .preloader');
        this.newsLoader = document.querySelector('.news .preloader');
    }

    showLoading(content) {
        content.classList.add('preloader--visible');
    }

    hideLoading(content) {
        content.classList.remove('preloader--visible');
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
                this.showLoading(this.tilesLoader);
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
                this.hideLoading(this.tilesLoader);
            })
            .catch(() => {
                this.main.noData('');
                this.hideLoading(this.tilesLoader);
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
                this.showLoading(this.tilesLoader);
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
                this.hideLoading(this.tilesLoader);
            })
            .catch(() => {
                this.getNews('');
                this.main.noData(code);
                this.hideLoading(this.tilesLoader);
            });
        // you must add spinner here later
    }

    getNews(countryName) {
        let link = `https://newsapi.org/v2/everything?language=en&q=covid+and+${countryName}%0D%0A&apiKey=a97cc839dd2d47feb52542d84d29ae9e`;

        if (countryName === '') {
            // Get top headlines about covid
            link = 'https://newsapi.org/v2/top-headlines?q=covid&apiKey=a97cc839dd2d47feb52542d84d29ae9e'
        }

        let news = [];

        fetch(link)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.showLoading(this.newsLoader);
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
                this.hideLoading(this.newsLoader);
            })
            .catch(() => {
                this.main.newsContainer.textContent = 'No data';
                this.hideLoading(this.newsLoader);
            });
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