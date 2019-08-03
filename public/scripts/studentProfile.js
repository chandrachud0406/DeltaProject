window.onload = drawRatingGraph;

function drawRatingGraph() {
    var userID = document.getElementById('save-profile').name;

    var url = `/student/${userID}/rating`;
    $("#save-profile").click(function () {
        $("#myToast").toast('show');
    });

    Chart.pluginService.register({
        beforeDraw: function (chart, easing) {
            if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                var helpers = Chart.helpers;
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;

                ctx.save();
                ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                ctx.restore();
            }
        }
    });
    fetch(url).then(function (res) {
        return res.json();
    }).then(function (ratings) {

        var dataArray = [];
        var labelsArray = [];
        for (var i = 0; i < ratings.length; i++) {
            dataArray.push(ratings[i].value);
            labelsArray.push(ratings[i].testNo);
        }

        console.log(`${dataArray} ### ${labelsArray}`);
        var statusChart = document.getElementById('rating-graph').getContext('2d');
        var ratingChart = new Chart(statusChart, {
            type: 'line',
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Score',
                    fill: false,
                    data: dataArray,
                    pointBackgroundColor: '#53b9e8',
                    borderColor: '#53b9e8',
                    pointRadius: 7,
                    pointBorderColor: '#06567a',
                    pointBorderWidth: 1,
                    pointHoverBorderWidth: 3,
                    pointHoverRadius: 10
                }]
            },
            options: {
                legend: {
                    display: false
                },
                elements: {
                    line: {
                        tension: 0 // disables bezier curves
                    }
                },
                chartArea: {
                    backgroundColor: '#e1e2e8'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 1000,
                            suggestedMax: 2000,
                        }
                    }]
                }
            }
        });



    })
        .catch(err => console.log(err))

}