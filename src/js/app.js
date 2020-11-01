import '../scss/app.scss';

/* Your JS Code goes here */

/* Demo JS */
import './demo.js';

import Chart from 'chart.js';

import SearchBar from "./SearchBar";

// -------------------------------------------

let searchBar = new SearchBar();


Chart.Tooltip.positioners.custom = function(elements, position) {
    //debugger;
    console.log(elements)
    return {
        x: position.x,
        y: 50
    }
}

Chart.plugins.register({
    afterDatasetsDraw: function(chart) {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            var activePoint = chart.tooltip._active[0],
                ctx = chart.ctx,
                y_axis = chart.scales['y-axis-0'],
                x = activePoint.tooltipPosition().x,
                topY = y_axis.top,
                bottomY = y_axis.bottom;
            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(37,174,255)';
            ctx.stroke();
            ctx.restore();
        }
    }
});

function drawChart (labels, data) {

    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: dailyNewCases['date'],
            labels: labels,
            datasets: [{
                label: 'daily new cases',
                // data: dailyNewCases['cases'],
                data: data,
                backgroundColor: [
                    'transparent',
                ],
                borderColor: [
                    'rgba(37,174,255)',
                ],
                borderWidth: 3,
                pointRadius: 0,

            }]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                // position: 'custom'
                position: 'nearest',
            },


        }
    });
}



let dailyNewCases = {
    date: [],
    cases: [],
};



function getDailyNewCasesFromDayOne(code) {
    fetch(`https://corona-api.com/countries/${code}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            data['data']['timeline'].forEach(covidInfo => {
                dailyNewCases['date'].push(covidInfo['date'])
                dailyNewCases['cases'].push(covidInfo['new_confirmed'])
            })
        })
        .then(function() {

            // to trzeba będzie usunąć -> błędne dane w api na 01.11?
            dailyNewCases['date'].splice(0,1);
            dailyNewCases['cases'].splice(0,1);

            drawChart(dailyNewCases['date'].reverse(), dailyNewCases['cases'].reverse());
        })
}

getDailyNewCasesFromDayOne('us')
