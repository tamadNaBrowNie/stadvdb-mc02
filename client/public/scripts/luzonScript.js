const dataContainer = document.getElementById('dataContainer');

function fetchDataAndDisplayInHTML() {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        dataContainer.innerHTML = '<h2>Fetched Data - Luzon</h2>';
        data.forEach(item => {
          const listItem = document.createElement('div');
          listItem.textContent = `${item.city}: ${item.population}`;
          dataContainer.appendChild(listItem);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Call the fetchDataAndDisplayInHTML function when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndDisplayInHTML();
  });

  

