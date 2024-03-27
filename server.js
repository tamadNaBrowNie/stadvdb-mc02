const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

function connectToDatabases() {
  // Connection to the main database
  const connection = mysql.createConnection({
    host: 'database.cdkmeqmso4yh.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    database: 'stadvdb',
    port: "3306"
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to main MySQL database:', err);
      return;
    }
    console.log('Connected to main MySQL database');
  });

  // Replica of the database - should be read-only
  const connectionReplica = mysql.createConnection({
    host: 'database-luzon.cdkmeqmso4yh.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    database: 'stadvdb',
    port: "3306"
  });

  connectionReplica.connect((err) => {
    if (err) {
      console.error('Error connecting to replica MySQL database:', err);
      return;
    }
    console.log('Connected to replica MySQL database');
  });

  // Return both connections
  return { connection, connectionReplica };
}

// Call the function to connect to databases
const { connection, connectionReplica } = connectToDatabases();

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
  // Attempt to query data from the main database
  connection.query("SELECT * FROM Manila", (mainErr, mainResult) => {
    if (mainErr) {
      // If there's an error with the main database connection, query data from the replica database
      console.error('Error querying main database:', mainErr);
      connectionReplica.query("SELECT * FROM Manila", (replicaErr, replicaResult) => {
        if (replicaErr) {
          // If there's an error with both connections, return an error response
          console.error('Error querying replica database:', replicaErr);
          return res.status(500).json({ error: replicaErr.message });
        } else {
          // If querying from the replica database succeeds, return the result
          res.json(replicaResult);
        }
      });
    } else {
      // If querying from the main database succeeds, return the result
      res.json(mainResult);
    }
  });
});

app.post('/api/insert', (req, res) => {
  const { city, population } = req.body;

  connection.query("INSERT INTO Manila (city, population) VALUES (?, ?)", [city, population], (mainErr, mainResult) => {
  if (mainErr) {
    // If there's an error with the main database connection, use the replica connection
    console.error('Error inserting data into main database:', mainErr);
    connectionReplica.query("INSERT INTO Manila (city, population) VALUES (?, ?)", [city, population], (replicaErr, replicaResult) => {
      if (replicaErr) {
        // If there's an error with both connections, return an error response
        console.error('Error inserting data into replica database:', replicaErr);
        return res.status(500).json({ error: replicaErr.message });
      } else {
        // If insertion into the replica database succeeds, return success response
        res.status(200).json({ message: 'Data inserted successfully into replica database' });
      }
    });
  } else {
    // If insertion into the main database succeeds, return success response
    res.status(200).json({ message: 'Data inserted successfully into main database' });
  }
});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
