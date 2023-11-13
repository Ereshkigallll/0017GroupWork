var ctx = document.getElementById('myChart').getContext('2d');



var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    },
    animation: {
        // add amination effect
        onComplete: function (animation) {
            document.getElementById('myChart').classList.add('animate__animated', 'animate__zoomIn');
        }
    }
};

//init data
var BarData = {
    labels: [],
    datasets: [{
        label: 'Total',
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(120, 200, 150, 0.5)',
            'rgba(180, 120, 220, 0.5)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(120, 200, 150, 1)',
            'rgba(180, 120, 220, 1)',
        ],
        borderWidth: 1
    }]
};

// Create a bar chart
var myChart = new Chart(ctx, {
    type: 'bar',
    data: BarData,
    options: options
});




//record the new data


function getBarChart() {
    var lng = preCenter.lng; // get the longitude of the center
    var lat = preCenter.lat;  // get the latitude of the center
    newData = getBarChartData(lat, lng, preradius);
    console.log(newData);

}


function getBarChartData(lat, lng, radius) {
    var newData = {
        labels: [],
        data: []
    }
    var url = `http://localhost:3000/futureCount?lat=${lat}&lon=${lng}&radius=${radius}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Process the data returned from the server
            JsonData = data;
            console.log(JsonData);
            JsonData.map(function (item) {
                newData.labels.push(item.Hour + 'h:'+getTimeGroup(item.time_group));
                newData.data.push(item.total);
            });
            console.log('test');
            console.log(newData);
            myChart.data.labels = newData.labels;
            myChart.data.datasets[0].data = newData.data;

            myChart.update();
            console.log(2);
            console.log(myChart.data);

        })
        .catch(error => console.error('Fail to request: ' + error));

}



function getTimeGroup(time_group) {
    switch (time_group) {
        case (1):
            return "0~15 m";
        case (2):
            return "16~30 m";
        case (3):
            return "31~45 m";
        case (4):
            return "46~59 m";
    }
    return 0;
}
