var preCenter = map.getCenter();
var preradius = null;


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
        clearTimeout(mapMoveTimer); // 取消之前的计时器
    }

    mapMoveTimer = setTimeout(function () {
    }, 500); // 500毫秒延迟（可根据需要调整）

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

