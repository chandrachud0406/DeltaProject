window.onload = drawGraph;

function drawGraph() {
    var url = window.location.href;
    url += '/data';
    console.log(url);

    fetch(url).then(function (res) {
        return res.json();
    }).then(function (obj) {
        Chart.pluginService.register({
            beforeDraw: function (chart) {
                if (chart.config.options.elements.center) {
                    //Get ctx from string
                    var ctx = chart.chart.ctx;

                    //Get options from the center object in options
                    var centerConfig = chart.config.options.elements.center;
                    var fontStyle = centerConfig.fontStyle || 'Arial';
                    var txt = centerConfig.text;
                    var color = centerConfig.color || '#000';
                    var sidePadding = centerConfig.sidePadding || 20;
                    var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
                    //Start with a base font of 30px
                    ctx.font = "30px " + fontStyle;

                    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    var stringWidth = ctx.measureText(txt).width;
                    var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                    // Find out how much the font can grow in width.
                    var widthRatio = elementWidth / stringWidth;
                    var newFontSize = Math.floor(30 * widthRatio);
                    var elementHeight = (chart.innerRadius * 2);

                    // Pick a new font size so it will not be larger than the height of label.
                    var fontSizeToUse = Math.min(newFontSize, elementHeight);

                    //Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse + "px " + fontStyle;
                    ctx.fillStyle = color;

                    //Draw text in center
                    ctx.fillText(txt, centerX, centerY);
                }
            }
        });

        // console.log()
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
        colorData.push('#d2d2d2');

        var doughChart0 = new Chart(percentageChart, {
            type: 'doughnut',
            data: {
                labels: ['% of Marks Scored'],
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
            },
            options: {
                cutoutPercentage: 80,
                elements: {
                    center: {
                        text: `${percentageMarks}%`,
                        color: 'black',
                        fontStyle: 'Helvetica',
                    }
                }
            },
            centerText: {
                display: true,
                text: '34%'
            }
        });

        //percentageChart.fillText();
        var status = obj.statusArray;
        var statusChart = document.getElementById('correct-graph').getContext('2d');
        var totalQuestions = status.reduce((a, b) => a + b, 0)

        var barChart = new Chart(statusChart, {
            type: 'horizontalBar',
            data: {
                labels: ['Attempted', 'Wrong', 'Unattempted'],
                datasets: [{
                    label: 'No of questions',
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
                //       cutoutPercentage: 80,
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: totalQuestions,
                            precision: 0
                        }
                    }]
                }
            }
        });

        function secondsToTime(secs) {
            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);
            minutes = minutes < 10 ? '0' + minutes : minutes;

            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);
            seconds = seconds < 10 ? '0' + seconds : seconds;

            return minutes + ':' + seconds;
        }

        var timeSpent = obj.timeSpentArray;
        var timeChart = document.getElementById('time-graph').getContext('2d');

        // var timeSpentArrayInMinutes = timeSpent;
        // for (var i = 0; i < timeSpent.length; i++) {
        //     timeSpentArrayInMinutes[i] = secondsToTime(timeSpent[i]);
        // }

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
                }],
                options: {
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItem, data) {
                                return data['labels'][tooltipItem[0]['index']];
                            },
                            label: function (tooltipItem, data) {
                                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                if (label) {
                                    label += ': ';
                                }
                                label += "  " + secondsToTime;
                                return label;
                            }
                        }
                    }
                }
            }
        });

    }).catch(function (err) {
        console.log(err);
    })
}