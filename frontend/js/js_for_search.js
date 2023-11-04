mapboxgl.accessToken = 'pk.eyJ1IjoieXV0b25nMDYyOSIsImEiOiJjbG9jM2IwNm0weWxqMmlubjB4b2V2ZWF5In0.DvGhBLaLcFQpyalSaXaYiw'; // 替换为你自己的Mapbox访问令牌

const map = new mapboxgl.Map({
    container: 'map-container', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

document.getElementById('search-button').addEventListener('click', function () {
    var searchTerm = document.getElementById('search-input').value;

    geocoder.query(searchTerm);

    geocoder.on('result', function (e) {
        // 获取地理编码结果
        var result = e.result;

        // 获取地点的经纬度
        var coordinates = result.geometry.coordinates;

        // 在地图上添加标记
        new mapboxgl.Marker().setLngLat(coordinates).addTo(map);

        // 将地图中心设置为搜索结果的位置
        map.setCenter(coordinates);
    });
});