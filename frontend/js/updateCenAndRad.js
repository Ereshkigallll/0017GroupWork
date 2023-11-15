var preCenter = map.getCenter();
var preradius = null;
let mapMoveTimer;

/*In order to save server resources and avoid sending requests 
**to the server as a result of minor changes, 
**requests are sent to the nodeJs server only when the ratio of the 
**current radius to the original radius column is less than 0.5 or
**greater than 1.15 or the location of the center point in the map
**changes by more than 0.25 of the original radius
** (distance from the center point to the four corners)
*/

function ifUpdate(){
    if (mapMoveTimer) {
        clearTimeout(mapMoveTimer); // Cancell the previous timer
    }

    mapMoveTimer = setTimeout(function () {
    }, 500); // 500 ms delay

    var bounds = map.getBounds();   // get the coordinates of bounds
    var ne = bounds.getNorthEast(); // get the northeast coordinates of the bounding box
    var sw = bounds.getSouthWest(); // get the southwest corner coordinates of the bounding box
    var radius = Math.floor(haversineDistance(ne.lat, ne.lng, sw.lat, sw.lng) / 2);

    var center = map.getCenter();
    return ifGetLocations(center, radius)
}

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


function haversineDistance(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    // Haversine Formula to calculate the distance
    var dlat = lat2 - lat1;
    var dlon = lon2 - lon1;
    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dlon / 2) * Math.sin(dlon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var radius = 6371000; // Radius of the Earth in metres
    return radius * c;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
