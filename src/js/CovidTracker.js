import SearchBar from "./SearchBar";
import Map from "./map";
import DrawChart from "./DrawChart";
import GetCovidData from "./GetCovidData";


export default class CovidTracker {
    constructor() {
        this.drawChart = new DrawChart();

        this.searchBar = new SearchBar(this);
        this.map = new Map(this);
        this.getCovidData = new GetCovidData(this)

        // Draw line chart with global data at start
        this.getCovidData.getDailyGlobalTimeline();
        this.getCovidData.getNews('')

        this.currentCountryName = document.querySelector('.data__current-country__name');
        this.currentCountryFlag = document.querySelector('.data__current-country__image');

        // Tiles
        this.tileDeaths = document.querySelector('.tile__left-data__cases.deaths');
        this.tileDeathsRatio = document.querySelector('.tile__right-data__difference.deaths');

        this.tileConfirmed = document.querySelector('.tile__left-data__cases.confirmed');
        this.tileConfirmedRatio = document.querySelector('.tile__right-data__difference.confirmed');

        this.tileActive = document.querySelector('.tile__left-data__cases.active');

        this.tileRecovered = document.querySelector('.tile__left-data__cases.recovered');
        this.tileRecoveredRatio = document.querySelector('.tile__right-data__difference.recovered');

        this.dataIcons = document.querySelectorAll('.tile__right-data__icon');

        // News
        this.newsContainer = document.querySelector('.news__articles');
    }

    noData(code) {
        this.updateCountryNameAndFlag(code, false);
        this.getCovidData.callDrawLineChart([0], [0]);
        this.updateTiles(false);
        this.dataIcons.forEach(icon => {
            icon.style.display = 'none'
        });
    }

    updateCountryNameAndFlag(code, tilesData) {
        let indexCountry = this.searchBar.countryCodes.indexOf(code);
        this.currentCountryFlag.src = this.searchBar.countryFlagsImg[indexCountry];
        if (!tilesData) {
            this.currentCountryName.textContent = this.searchBar.countryNames[indexCountry];
        } else {
            this.currentCountryName.textContent = tilesData.country_name;
        }

    }

    setColorOfRatio(ratio, tile) {
        this.dataIcons.forEach(icon => icon.style.display = 'block');
        if (tile === this.tileRecoveredRatio) {
            if (ratio >= 0.2) {
                tile.parentNode.style.color = 'green';
            } else if (ratio < 0.2 && ratio > 0) {
                tile.parentNode.style.color = 'grey';
            } else {
                tile.parentNode.style.color = 'red';
            }
        } else {
            if (ratio >= 0.2) {
                tile.parentNode.style.color = 'red';
            } else if (ratio < 0.2 && ratio > 0) {
                tile.parentNode.style.color = 'grey';
            } else {
                tile.parentNode.style.color = 'green';
            }
        }

    }

    calculateRatioToTiles(oldCases, newCases, tile) {
        //oldCases - in api is summed with newCases
        let currentCases = oldCases - newCases;
        let ratio = 0;
        if (currentCases !== 0) {
            // don't let divide by zero
            ratio = oldCases * 100 / currentCases - 100;
        }

        this.setColorOfRatio(ratio, tile);

        return ratio.toFixed(2) + '%';
    }

    updateTiles(tilesData) {
        if (!tilesData) {
            this.tileDeaths.textContent = 'No data';
            this.tileConfirmed.textContent = 'No data';
            this.tileActive.textContent = 'No data';
            this.tileRecovered.textContent = 'No data';

            this.tileDeathsRatio.textContent = '';
            this.tileRecoveredRatio.textContent = '';
            this.tileConfirmedRatio.textContent = '';
        } else {
            this.tileDeaths.textContent = tilesData['deaths'];
            this.tileConfirmed.textContent = tilesData['confirmed'];
            this.tileActive.textContent = tilesData['active'];
            this.tileRecovered.textContent = tilesData['recovered'];

            this.tileDeathsRatio.textContent = this.calculateRatioToTiles(tilesData['deaths'], tilesData['new_deaths'], this.tileDeathsRatio);
            this.tileRecoveredRatio.textContent = this.calculateRatioToTiles(tilesData['recovered'], tilesData['new_recovered'], this.tileRecoveredRatio);
            this.tileConfirmedRatio.textContent = this.calculateRatioToTiles(tilesData['confirmed'], tilesData['new_confirmed'], this.tileConfirmedRatio);
        }
    }

    calculateArticleDate(date) {
        // stackoverflow <3
        let seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    shortenTitle(title) {
        let stringLength = 60;

        if (title.length > stringLength) {
            return title.substr(0, stringLength) + '...';
        } else {
            return title;
        }
    }

    addArticle(article) {
        const newsTitle = document.querySelector('.news__title');
        newsTitle.textContent = article['countryName'].length > 0 ? `Top news for ${article['countryName']}` : 'Top news';

        const newArticle = document.createElement('div');
        const source = document.createElement('p');
        const title = document.createElement('a');
        const containerImage = document.createElement('div');
        const image = document.createElement('img');

        const date = document.createElement('p');
        const leftContent = document.createElement('div');
        const rightContent = document.createElement('div');

        leftContent.classList.add('article__left-content');
        rightContent.classList.add('article__right-content');
        newArticle.classList.add('article');

        newArticle.appendChild(leftContent);
        newArticle.appendChild(rightContent);
        rightContent.appendChild(containerImage);

        source.classList.add('article__source');
        title.classList.add('article__title');
        containerImage.classList.add('article__container-image');
        image.classList.add('article__image');
        date.classList.add('article__date');

        source.textContent = article['source'];
        title.href = article['url'];
        title.target = '_blank';

        image.src = article['image'];
        date.textContent = this.calculateArticleDate(new Date(article['date'])) + ' ago';

        this.newsContainer.appendChild(newArticle);
        leftContent.appendChild(source);
        leftContent.appendChild(title);
        if (article['image'] !== 'https://s1.reutersmedia.net/resources_v2/images/rcom-default.png?w=800' &&
        article['image'] !== null) {
            containerImage.appendChild(image);
            title.textContent = this.shortenTitle(article['title']);
        } else {
            leftContent.style.flexBasis = '100%';
            rightContent.style.flexBasis = '0';
            title.textContent = article['title'];
        }
        leftContent.appendChild(date);
    }


    updateNews(news) {
        // Reset news
        this.newsContainer.textContent = '';
        news.forEach(article => this.addArticle(article));
    }
}


// You must add loading screens, sticky input and desktop version!