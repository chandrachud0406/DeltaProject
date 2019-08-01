window.onload = drawRatingGraph;

function drawRatingGraph() {
    var userID = document.getElementById('save-profile').name;

    var url = `/student/${userID}/rating`;

    fetch(url).then(function (res) {
        return res.json();
    }).then(function (ratings) {

        var dataArray = [];
        var labelsArray = [];
        for (var i = 0; i < ratings.length; i++) {
            dataArray.push(currentStud.rating[i].value);
            labelsArray.push(currentStud.rating[i].testNo);
        }

        var statusChart = document.getElementById('rating-graph').getContext('2d');
        var ratingChart = new Chart(statusChart, {
            type: 'horizontalBar',
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Score',
                    data: dataArray,
                }]
            },
            options: {
                legend: {
                    display: false
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



    })
        .catch(err => console.log(err))

}