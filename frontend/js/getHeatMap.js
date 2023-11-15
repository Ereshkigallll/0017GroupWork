var features = null;
var geojsonData =
{
    type: 'FeatureCollection',
    features: features
};
map.on('style.load', function () {
    map.addSource('HeatMap-Source', {
        type: 'geojson',
        data: geojsonData // Including new coordinate data for the GeoJSON
    });

    //heatmap layer
    map.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'HeatMap-Source',
        paint: {
            'heatmap-weight': {
                property: 'intensity', // Replace with the name of data property
                type: 'exponential',
                stops: [
                    [0, 0],
                    [5, 1]
                ]
            },
            'heatmap-intensity': 1,
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': 30
        }
    });
});




function getCoords(){
        console.log("change!!!", preCenter, preradius);
        var lng = preCenter.lng; // get the longitude of the center
        var lat = preCenter.lat;  // get the latitude of the center

        //get Records in the 1.25 preradius range are obtained 
        //based on the latitude and longitude of the preCenter
        //and update the heatmap source
        getLocations(lat, lng); 

        console.log('radius(metre):', preradius);
};







function getLocations(lat, lng) {
    var feats = null;
    var radius = preradius*1.25;
    var url = `http://localhost:8891/getNearByTaxi?lat=${lat}&lon=${lng}&radius=${radius}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            JsonData = data;
            features = JsonData.map(function (item) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [item.pickup_longitude, item.pickup_latitude]
                    },
                    properties: {
                        distance: item.distance

                    }
                };
            });

            geojsonData.features = features;

            map.getSource('HeatMap-Source')
                .setData(geojsonData);

            console.log(1);
        })
        .catch(error => console.error('Fail to request: ' + error));

}



