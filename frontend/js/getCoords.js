
var preCenter = map.getCenter();
var preradius = null;


var features = null;
var geojsonData =
{
    type: 'FeatureCollection',
    features: features
};
map.on('style.load', function () {
    map.addSource('HeatMap-Source', {
        type: 'geojson',
        data: geojsonData // 包括新坐标数据的 GeoJSON
    });

    //heatmap layer
    map.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'HeatMap-Source',
        paint: {
            'heatmap-weight': {
                property: 'intensity', // 替换为您的数据属性名称
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

let mapMoveTimer;
map.on('move', function () {
    if (mapMoveTimer) {
        clearTimeout(mapMoveTimer); // 取消之前的计时器
    }

    mapMoveTimer = setTimeout(function () {
    }, 500); // 500毫秒延迟（可根据需要调整）

    var bounds = map.getBounds();   // get the coordinates of bounds
    var ne = bounds.getNorthEast(); // get the northeast coordinates of the bounding box
    var sw = bounds.getSouthWest(); // get the southwest corner coordinates of the bounding box
    var radius = Math.floor(haversineDistance(ne.lat, ne.lng, sw.lat, sw.lng) / 2);

    var center = map.getCenter();
    if (ifGetLocations(center, radius)) {
        console.log("change!!!", preCenter, preradius);
        var lng = center.lng; // get the longitude of the center
        var lat = center.lat;  // get the latitude of the center

        //get Records in the 1.25 preradius range are obtained 
        //based on the latitude and longitude of the preCenter
        //and update the heatmap source
        getLocations(lat, lng); 

        console.log('radius(metre):', radius);
    }
});







/*In order to save server resources and avoid sending requests 
**to the server as a result of minor changes, 
**requests are sent to the nodeJs server only when the ratio of the 
**current radius to the original radius column is less than 0.5 or
**greater than 1.15 or the location of the center point in the map
**changes by more than 0.25 of the original radius
** (distance from the center point to the four corners)
*/
function ifGetLocations(center, rad) {
    var scale = rad / preradius;
    if (preradius == null || scale < 0.5 || scale > 1.15) {

        console.log('radius change')
        preradius = rad;
        return true;
    }
    var distance = Math.floor(haversineDistance(center.lat, center.lng, preCenter.lat, preCenter.lng))
    if (4 * distance > rad) {
        console.log('center change')
        preCenter = center;
        return true;
    }
    return false

}

function getLocations(lat, lng) {
    var feats = null;
    var radius = preradius*1.25;
    var url = `http://localhost:3000/homeLocation?lat=${lat}&lon=${lng}&radius=${radius}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 处理从服务器返回的数据
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
        .catch(error => console.error('请求失败: ' + error));




}

function haversineDistance(lat1, lon1, lat2, lon2) {
    // 将经纬度从度转换为弧度
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    // Haversine 公式计算距离
    var dlat = lat2 - lat1;
    var dlon = lon2 - lon1;
    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dlon / 2) * Math.sin(dlon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var radius = 6371000; // 地球半径，单位为米
    return radius * c;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}


