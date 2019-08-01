window.onload = drawGraph;

function drawGraph() {
    var url = window.location.href;
    url += '/data';
    console.log(url);

    fetch(url).then(function (res) {
        return res.json();
    }).then(function (obj) {

        console.log()
        var percentageMarks = Number((obj.score).toFixed(2));
        var percentageData = [percentageMarks, (100 - percentageMarks)];
        var percentageChart = document.getElementById('percentage-graph').getContext('2d');
        var colorData = [];

        if (percentageMarks <= 100 && percentageMarks >= 75) {
            colorData.push('green');
        } else if (percentageMarks < 75 && percentageMarks >= 50) {
            colorData.push('orange');
        } else if (percentageMarks < 50 && percentageMarks >= 25) {
            colorData.push('yellow');
        } else if (percentageMarks < 25 && percentageMarks >= 0) {
            colorData.push('red');
        }
        colorData.push('grey');
        var doughChart0 = new Chart(percentageChart, {
            type: 'doughnut',
            data: {
                labels: ['MarksAttempted, MarksLeft'],
                datasets: [{
                    label: 'Percentage',
                    data: percentageData,
                    backgroundColor: colorData,
                    borderWidth: 0.1,
                    borderColor: '#777',
                    hoverBorderWidth: 1,
                    hoverBorderColor: '#000',
                    cutoutPercentage: 90
                }]
            }
        });
        var status = obj.statusArray;
        var statusChart = document.getElementById('correct-graph').getContext('2d');

        var barChart = new Chart(statusChart, {
            type: 'horizontalBar',
            data: {
                labels: ['Attempted', 'Wrong', 'Unattempted'],
                datasets: [{
                    label: 'Responses',
                    data: status,
                    backgroundColor: [
                        '#29b999',
                        '#ed6060',
                        '#d2d2d2',
                    ],
                    borderWidth: 1,
                    borderColor: '#777',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#000'

                }]
            },
            options: {
                cutoutPercentage:80,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'How did you score ?'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        var timeSpent = obj.timeSpentArray;
        var timeChart = document.getElementById('time-graph').getContext('2d');

        var doughChart = new Chart(timeChart, {
            type: 'doughnut',
            data: {
                labels: ['Attempted', 'Wrong', 'Unattempted'],
                datasets: [{
                    label: 'Time Spent',
                    data: timeSpent,
                    backgroundColor: [
                        '#29b999',
                        '#ed6060',
                        '#d2d2d2'
                    ],
                    borderWidth: 1,
                    borderColor: '#777',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#000'
                }]
            }
        });

    }).catch(function (err) {
        console.log(err);
    })
}