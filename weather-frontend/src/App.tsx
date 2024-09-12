import React, { useState } from 'react';

interface WeatherForecast {
  date: string;
  min_temp: number;
  max_temp: number;
  rain_chance: number;
  wind_speed: number;
}

function App() {
  const [city, setCity] = useState<string>('');           // Stadt
  const [startDate, setStartDate] = useState<string>(''); // Startdatum
  const [endDate, setEndDate] = useState<string>('');     // Enddatum
  const [forecast, setForecast] = useState<WeatherForecast[] | null>(null); // Wettervorhersage
  const [error, setError] = useState<string | null>(null); // Fehler-Handling

  const handleSearch = async () => {
    // Überprüfe, ob Stadt und Datumswerte vorhanden sind
    if (!city || !startDate || !endDate) {
      setError("Bitte Stadt, Startdatum und Enddatum eingeben");
      return;
    }

    try {
      setError(null); // Setze den Fehler zurück
      const response = await fetch(
        `http://localhost:5000/weather?city=${city}&startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data: WeatherForecast[] = await response.json();
      setForecast(data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Wettervorhersage:', error);
      setError('Ein Fehler ist aufgetreten');
    }
  };

  return (
    <div className="App">
      <h1>Wettervorhersage</h1>

      {/* Eingabe für die Stadt */}
      <div>
        <input
          type="text"
          placeholder="Stadt eingeben"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Auswahl für das Startdatum */}
      <div>
        <label>Von: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      {/* Auswahl für das Enddatum */}
      <div>
        <label>Bis: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Button, um die Suche auszulösen */}
      <button onClick={handleSearch}>Suchen</button>

      {/* Fehlermeldung anzeigen */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Wettervorhersage anzeigen */}
      {forecast && (
        <div>
          <h2>Vorhersage für {city}</h2>
          <ul>
            {forecast.map((day, index) => (
              <li key={index}>
                {day.date}: Min {day.min_temp}°C, Max {day.max_temp}°C, Regen {day.rain_chance}%, Wind {day.wind_speed} km/h
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
