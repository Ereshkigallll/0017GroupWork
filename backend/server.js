const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Activate CORS

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'ridelink'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Fail to connect the database: ' + err.stack);
    return;
  }
  console.log('connect to the database successfully');
});


app.use(express.static('public'));

// Set up routes and process database requests
app.get('/data', (req, res) => {
  // Execute query
  db.query('SELECT * FROM trip LIMIT 10', (err, rows) => {
    if (err) {
      console.error('Err: ' + err.stack);
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`server is listening port ${port}`);
});

app.get('/homeLocation', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const radius = parseFloat(req.query.radius);

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  var time_group = getTimeGroup(minutes);


  // Execute query
  db.query('SELECT *, ST_Distance_Sphere(pickup_location, POINT(?,?)) AS distance ' +
    'FROM `trip` WHERE ' +
    'ST_Distance_Sphere(pickup_location, POINT(?,?)) < ? and `Hour` =' + hours + ' and time_group = ' + time_group
    , [lon, lat, lon, lat, radius], (err, rows) => {
      if (err) {
        console.error('Err: ' + err.stack);
        return;
      }
      res.json(rows);
    });
});

app.get('/futureCount', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const radius = parseFloat(req.query.radius);

  const currentDate = new Date();
  var hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  var time_group = getTimeGroup(minutes);

  // Execute query
  db.query('SELECT Hour, time_group, COUNT(*) as total ' +
    'FROM `trip` WHERE ' +
    'ST_Distance_Sphere(pickup_location, POINT(?,?)) < ? '+
    'and (Hour, time_group) IN '+ getFutureTime(hours, time_group) +
    'GROUP BY Hour, time_group '+
    'ORDER BY Hour, time_group;'
    , [lon, lat, radius], (err, rows) => {
      if (err) {
        console.error('Err: ' + err.stack);
        return;
      }
      res.json(rows);
    });



});



function getTimeGroup(minutes) {
  if (0 <= minutes && minutes <= 15) {
    return 1;
  }
  else if (15 < minutes && minutes <= 30) {
    return 2;
  }
  else if (30 < minutes && minutes <= 45) {
    return 3;
  }
  else {
    return 4;
  }
};

function getFutureTime(hours, time_group){
  var res = '(';
  for(var i = 0; i < 5; i++){
    var temp = '(';
    temp = temp + hours.toString() + ','+time_group+'),';
    res +=temp;
    if(++time_group>4){
      time_group-=4;
      hours++;
    }
  }
  res = res+'('+ hours.toString() + ','+time_group+')) '
  console.log(res);
  return res;
}

