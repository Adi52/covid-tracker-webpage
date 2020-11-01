import Chart from 'chart.js';


export default class DrawChart {
    constructor(covidInfo) {
        this.color = 'rgba(37,174,255)';
        this.ctx = document.getElementById('myChart').getContext('2d');

        this.covidInfo = covidInfo;
        this.configureCustomEffects();
        this.drawChart();
    }

    drawChart () {
        let myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                // labels: dailyNewCases['date'],
                labels: this.covidInfo.date,
                datasets: [{
                    label: 'daily new cases',
                    // data: dailyNewCases['cases'],
                    data: this.covidInfo.cases,
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
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    // position: 'custom'
                    position: 'nearest',
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