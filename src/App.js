import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [city, setCity] = useState('Austin');
  const [weatherData, setWeatherData] = useState([]);
  const [cities, setCities] = useState(['Austin', 'Dallas', 'Houston']);
  const [newCity, setNewCity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`);
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Could not find weather for ${cityName}`);
      }
      
      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
      const weatherData = await weatherResponse.json();
      
      setWeatherData(weatherData.hourly.time.map((time, index) => ({
        time: new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        temperature: weatherData.hourly.temperature_2m[index]
      })));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCityClick = (cityName) => {
    setCity(cityName);
  };

  const handleAddCity = async () => {
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${newCity}&count=1&language=en&format=json`);
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        setError(`Could not find weather for ${newCity}`);
        return;
      }
      
      if (!cities.includes(newCity)) {
        setCities([...cities, newCity]);
      }
      setCity(newCity);
      setNewCity('');
    } catch (err) {
      setError(`Could not find weather for ${newCity}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '20px' }}>
        {cities.map((c) => (
          <button 
            key={c} 
            onClick={() => handleCityClick(c)} 
            style={{ marginRight: '10px', padding: '10px', fontWeight: city === c ? 'bold' : 'normal' }}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newCity} 
          onChange={(e) => setNewCity(e.target.value)} 
          placeholder="Add a city" 
        />
        <button onClick={handleAddCity} style={{ marginLeft: '10px', padding: '10px' }}>+</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.slice(0, 12).map((data, index) => (
            <tr key={index}>
              <td>{data.time}</td>
              <td>{data.temperature} C</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherApp;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
