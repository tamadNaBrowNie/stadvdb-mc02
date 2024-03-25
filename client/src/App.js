import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExampleComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Get the server URL from environment variables or use a default value
    const apiUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001/api/data';

    axios.get(apiUrl)
      .then(response => {
        setData(response.data);
        console.log('Data:', response.data); // Log the data to the console
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Dummy Data from AWS db</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.city} {item.population}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleComponent;
