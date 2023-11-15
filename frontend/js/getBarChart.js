var ctx = document.getElementById('myChart').getContext('2d');


var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    },
    animation: {
        // Add animation effects
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
            'rgba(168, 211, 246, 0.5)',
            'rgba(157, 184, 229, 0.5)',
            'rgba(154, 155, 207, 0.5)',
            'rgba(153, 126, 179, 0.5)',
            'rgba(151, 97, 145, 0.5)',
            'rgba(145, 69, 107, 0.5)',
        ],
        borderColor: [
            'rgba168, 211, 246, 1)',
            'rgba(157, 184, 229, 1)',
            'rgba(154, 155, 207, 1)',
            'rgba(153, 126, 179, 1)',
            'rgba(151, 97, 145, 1)',
            'rgba(145, 69, 107, 1)',
        ],
        borderWidth: 1
    }]
};

// Creat Bar Charts
var myChart = new Chart(ctx, {
    type: 'bar',
    data: BarData,
    options: options
});




//record the new data
var controller = new AbortController();
var signal = controller.signal;

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
    var url = `http://localhost:8892/getFutureCount?lat=${lat}&lon=${lng}&radius=${radius}`
    
    controller.abort(); 
    controller = new AbortController();
    signal = controller.signal;

    fetch(url,{signal})
        .then(response => response.json())
        .then(data => {
            // Processing of data returned from the server
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
        .catch(error => console.error('Request Failed: ' + error));

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
