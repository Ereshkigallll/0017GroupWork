mapboxgl.accessToken = 'https://api.mapbox.com/styles/v1/yutong0629/cloc3h4aj013y01qx5kvs2huq.html?title=false&access_token=pk.eyJ1IjoieXV0b25nMDYyOSIsImEiOiJjbG9jM2IwNm0weWxqMmlubjB4b2V2ZWF5In0.DvGhBLaLcFQpyalSaXaYiw&zoomwheel=false#13.32/40.70958/-74.00441'; // 替换为你自己的Mapbox访问令牌

var map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/streets-v11', // 替换为你选择的地图样式
    center: [0, 0], // 默认地图中心坐标
    zoom: 9 // 默认缩放级别
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