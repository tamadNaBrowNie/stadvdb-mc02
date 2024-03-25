const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors middleware

const app = express();

// Use the cors middleware to enable CORS
app.use(cors());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'database.cdkmeqmso4yh.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'stadvdb',
  port: "3306"
});

// Connect to MySQL
connection.connect();

app.get('/users', (req, res) => {
  connection.query("SELECT * FROM cities", (err, result) => {
      if (err) {
          return res.json(err);
      } else {
          res.json(result);
      }
  })
})

// Define API route to fetch data from the SQL database
app.get('/api/data', (req, res) => {
  connection.query("SELECT * FROM cities", (err, result) => {
    if (err) {
        return res.json(err);
    } else {
        res.json(result);
    }
  })
})

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
