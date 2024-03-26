const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

const connection = mysql.createConnection({
  host: 'database.cdkmeqmso4yh.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'stadvdb',
  port: "3306"
});

// Replica of the database - should be read only
const connection_replica = mysql.createConnection({
  host: 'database-node2.cdkmeqmso4yh.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'stadvdb',
  port: "3306"
});

connection.connect();
connection_replica.connect();

app.use(express.static('client/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public', 'homePage.html'));
});

app.get('/luzon', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public', 'luzon.html'));
});

app.get('/vismin', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public', 'vismin.html'));
});

app.get('/api/data', (req, res) => {
  connection.query("SELECT * FROM Manila", (err, result) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    } else {
        res.json(result);
    }
  })
});

app.get('/api/data-replica', (req, res) => {
  connection.query("SELECT * FROM Manila", (err, result) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    } else {
        res.json(result);
    }
  })
});

app.post('/api/insert', (req, res) => {
  const { city, population } = req.body;

  connection.query("INSERT INTO Manila (city, population) VALUES (?, ?)", [city, population], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: err.message }); // Return error message
    } else {
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
