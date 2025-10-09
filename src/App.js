
import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`http://localhost:3001/api/search?query=${query}&lat=${latitude}&lon=${longitude}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data.source === 'url_search') {
              setResults(data.results);
            }
            setLoading(false);
          })
          .catch(error => {
            setError('Failed to fetch results. Is the backend server running?');
            setLoading(false);
          });
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Find Food Nearby</h1>
        <p>What would you like to eat today?</p>
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'croissant'"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </header>

      <main className="results-container">
        {error && <p className="error">{error}</p>}
        
        {searched && !loading && results.length > 0 && (
          <div>
            <h2>Check these stores:</h2>
            <p>Click the link to search for the item on the store's own website.</p>
            <div className="results-grid">
              {results.map(store => (
                <div key={store.id} className="result-card">
                  <h3>{store.name}</h3>
                  <div className="card-links">
                    <a href={store.storeSearchUrl} target="_blank" rel="noopener noreferrer" className="button-like">
                      Search on Store's Site
                    </a>
                    <a href={store.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="button-like">
                      Find Store Location
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <div className="fallback-container">
            <h2>Sorry!</h2>
            <p>We couldn't find any partner stores with a searchable menu for that item.</p>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
