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
  database: 'webml'
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
  db.query('SELECT * FROM userinfo', (err, rows) => {
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