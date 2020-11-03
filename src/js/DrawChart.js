import Chart from 'chart.js';


export default class DrawChart {
    constructor() {
        this.color = 'rgba(37,174,255)';
        this.ctx = document.getElementById('myChart').getContext('2d');

        this.configureCustomEffects();
    }

    drawChart(covidInfo) {
        if (this.myChart !== undefined) this.myChart.destroy();

        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                // labels: dailyNewCases['date'],
                labels: covidInfo.date,
                datasets: [{
                    label: 'Daily new cases',

                    data: covidInfo.cases,
                    backgroundColor: [
                        'transparent',
                    ],
                    borderColor: [
                        this.color,
                    ],
                    borderWidth: 3,
                    pointRadius: 0,

                }]
            },
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    // position: 'custom'
                    position: 'nearest',
                },

                scales: {
                    xAxes: [{
                        offset: true,
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            labelOffset: 30,
                            maxTicksLimit: 5,
                            maxRotation: 0,
                            minRotation: 0,
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                        }
                    }]
                },
            }
        });
    }

    configureCustomEffects() {
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
                    ctx.strokeStyle = this.color;
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });
    }
}