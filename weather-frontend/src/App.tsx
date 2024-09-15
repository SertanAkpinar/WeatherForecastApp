/*import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

interface WeatherData {
    date: string;
    min_temp: number;
    max_temp: number;
    rain_chance: number;
    wind_speed: number;
}

const App: React.FC = () => {
    const [location, setLocation] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        if (!location || !startDate || !endDate) {
            setError('Bitte gib einen Standort, Startdatum und Enddatum ein.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/weather', {
                params: {
                    location,
                    start: startDate,
                    end: endDate,
                },
            });
            setWeatherData(response.data);
            setError(null);
        } catch (err) {
            setError('Fehler beim Abrufen der Wetterdaten.');
            setWeatherData([]);
        }
    };

    const sendEmail = async () => {
        if (!email || !location) {
            setError('Bitte gib eine E-Mail-Adresse ein.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/send-email', {
                email,
                location,
                weather_data: weatherData,
            });
            setError(null);
            alert('Wettervorhersage erfolgreich gesendet!');
        } catch (err) {
            setError('Fehler beim Senden der E-Mail.');
        }
    };

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="mb-4 text-center">Wettervorhersage</h1>
            <div className="d-flex align-items-center mb-3 gap-3">
                <div className="flex-fill">
                    <label htmlFor="location" className="form-label">Standort</label>
                    <input
                        id="location"
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Gib einen Standort ein"
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="form-label">Startdatum</label>
                    <input
                        id="startDate"
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="form-label">Enddatum</label>
                    <input
                        id="endDate"
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={fetchWeather}>
                    Wetter abrufen
                </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weatherData.length > 0 && (
                <div className="row">
                    {weatherData.map((day) => (
                        <div className="col-md-4 mb-4" key={day.date}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{format(new Date(day.date), 'dd.MM.yyyy')}</h5>
                                    <p className="card-text">
                                        <strong>Minimale Temperatur:</strong> {day.min_temp}°C
                                    </p>
                                    <p className="card-text">
                                        <strong>Maximale Temperatur:</strong> {day.max_temp}°C
                                    </p>
                                    <p className="card-text">
                                        <strong>Regenwahrscheinlichkeit:</strong> {day.rain_chance}%
                                    </p>
                                    <p className="card-text">
                                        <strong>Windgeschwindigkeit:</strong> {day.wind_speed} km/h
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {weatherData.length > 0 && (
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-Mail-Adresse</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Gib eine E-Mail-Adresse ein"
                    />
                    <button className="btn btn-success mt-3" onClick={sendEmail}>
                        Wettervorhersage per E-Mail senden
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;*/

/*import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

interface WeatherData {
    date: string;
    min_temp: number;
    max_temp: number;
    rain_chance: number;
    wind_speed: number;
    feelslike?: string;
    sunrise?: string;  // sunrise should be a time
    sunset?: string;   // sunset should be a time
}

const App: React.FC = () => {
    const [location, setLocation] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [additionalDetails, setAdditionalDetails] = useState<string[]>([]);

    const fetchWeather = async () => {
        if (!location || !startDate || !endDate) {
            setError('Bitte gib einen Standort, Startdatum und Enddatum ein.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/weather', {
                params: {
                    location,
                    start: startDate,
                    end: endDate,
                    includeFeelslike: additionalDetails.includes('feelslike'),
                    includeSunrise: additionalDetails.includes('sunrise'),
                    includeSunset: additionalDetails.includes('sunset'),
                },
            });
            setWeatherData(response.data);
            setError(null);
        } catch (err) {
            setError('Fehler beim Abrufen der Wetterdaten.');
            setWeatherData([]);
        }
    };

    const sendEmail = async () => {
        if (!email || !location) {
            setError('Bitte gib eine E-Mail-Adresse ein.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/send-email', {
                email,
                location,
                weather_data: weatherData,
            });
            setError(null);
            alert('Wettervorhersage erfolgreich gesendet!');
        } catch (err) {
            setError('Fehler beim Senden der E-Mail.');
        }
    };

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="mb-4 text-center">Wettervorhersage</h1>
            <div className="d-flex align-items-center mb-3 gap-3">
                <div className="flex-fill">
                    <label htmlFor="location" className="form-label">Standort</label>
                    <input
                        id="location"
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Gib einen Standort ein"
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="form-label">Startdatum</label>
                    <input
                        id="startDate"
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="form-label">Enddatum</label>
                    <input
                        id="endDate"
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={fetchWeather}>
                    Wetter abrufen
                </button>
            </div>
            <div className="mb-3">
                <label htmlFor="additionalDetails" className="form-label">Zusätzliche Details</label>
                <select
                    id="additionalDetails"
                    className="form-select"
                    multiple
                    value={additionalDetails}
                    onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, option => option.value);
                        setAdditionalDetails(options);
                    }}
                >
                    <option value="feelslike">Gefühlte Temperatur</option>
                    <option value="sunrise">Sonnenaufgang</option>
                    <option value="sunset">Sonnenuntergang</option>
                </select>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weatherData.length > 0 && (
                <div className="row">
                    {weatherData.map((day) => (
                        <div className="col-md-4 mb-4" key={day.date}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{format(new Date(day.date), 'dd.MM.yyyy')}</h5>
                                    <p className="card-text">
                                        <strong>Minimale Temperatur:</strong> {day.min_temp}°C
                                    </p>
                                    <p className="card-text">
                                        <strong>Maximale Temperatur:</strong> {day.max_temp}°C
                                    </p>
                                    <p className="card-text">
                                        <strong>Regenwahrscheinlichkeit:</strong> {day.rain_chance}%
                                    </p>
                                    <p className="card-text">
                                        <strong>Windgeschwindigkeit:</strong> {day.wind_speed} km/h
                                    </p>
                                    {day.feelslike && (
                                        <p className="card-text">
                                            <strong>Gefühlte Temperatur:</strong> {day.feelslike}°C
                                        </p>
                                    )}
                                    {day.sunrise && (
                                        <p className="card-text">
                                            <strong>Sonnenaufgang:</strong> {day.sunrise}
                                        </p>
                                    )}
                                    {day.sunset && (
                                        <p className="card-text">
                                            <strong>Sonnenuntergang:</strong> {day.sunset}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {weatherData.length > 0 && (
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-Mail-Adresse</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Gib eine E-Mail-Adresse ein"
                    />
                    <button className="btn btn-success mt-3" onClick={sendEmail}>
                        Wettervorhersage per E-Mail senden
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;*/

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

interface WeatherData {
    date: string;
    min_temp: number;
    max_temp: number;
    rain_chance: number;
    wind_speed: number;
    feelslike?: string;
    sunrise?: string; 
    sunset?: string;  
    humidity?: number;
    cloudcover?: number;
    conditions?: string;
}

const App: React.FC = () => {
    const [location, setLocation] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<string[]>([]);

    const fetchWeather = async () => {
        if (!location || !startDate || !endDate) {
            setError('Bitte gib einen Standort, Startdatum und Enddatum ein.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/weather', {
                params: {
                    location,
                    start: startDate,
                    end: endDate,
                    includeFeelslike: selectedDetails.includes('feelslike'),
                    includeSunrise: selectedDetails.includes('sunrise'),
                    includeSunset: selectedDetails.includes('sunset'),
                    includeHumidity: selectedDetails.includes('humidity'),
                    includeCloudcover: selectedDetails.includes('cloudcover'),
                    includeConditions: selectedDetails.includes('conditions'),
                },
            });
            setWeatherData(response.data);
            setError(null);
        } catch (err) {
            setError('Fehler beim Abrufen der Wetterdaten.');
            setWeatherData([]);
        }
    };

    const sendEmail = async () => {
        if (!email || !location) {
            setError('Bitte gib eine E-Mail-Adresse ein.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/send-email', {
                email,
                location,
                weather_data: weatherData,
            });
            setError(null);
            alert('Wettervorhersage erfolgreich gesendet!');
        } catch (err) {
            setError('Fehler beim Senden der E-Mail.');
        }
    };

    const handleCheckboxChange = (detail: string) => {
        setSelectedDetails(prevState =>
            prevState.includes(detail)
                ? prevState.filter(item => item !== detail)
                : [...prevState, detail]
        );
    };

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="mb-4 text-center">Wettervorhersage</h1>
            <div className="d-flex align-items-center mb-3 gap-3">
                <div className="flex-fill">
                    <label htmlFor="location" className="form-label">Standort</label>
                    <input
                        id="location"
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Gib einen Standort ein"
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="form-label">Startdatum</label>
                    <input
                        id="startDate"
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="form-label">Enddatum</label>
                    <input
                        id="endDate"
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={fetchWeather}>
                    Wetter abrufen
                </button>
            </div>
            <div className="mb-3">
                <label className="form-label">Zusätzliche Details</label>
                <div className="form-check">
                    <input
                        id="feelslike"
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedDetails.includes('feelslike')}
                        onChange={() => handleCheckboxChange('feelslike')}
                    />
                    <label htmlFor="feelslike" className="form-check-label">Gefühlte Temperatur</label>
                </div>
                <div className="form-check">
                    <input
                        id="sunrise"
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedDetails.includes('sunrise')}
                        onChange={() => handleCheckboxChange('sunrise')}
                    />
                    <label htmlFor="sunrise" className="form-check-label">Sonnenaufgang</label>
                </div>
                <div className="form-check">
                    <input
                        id="sunset"
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedDetails.includes('sunset')}
                        onChange={() => handleCheckboxChange('sunset')}
                    />
                    <label htmlFor="sunset" className="form-check-label">Sonnenuntergang</label>
                </div>
                <div className="form-check">
                    <input
                        id="humidity"
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedDetails.includes('humidity')}
                        onChange={() => handleCheckboxChange('humidity')}
                    />
                    <label htmlFor="humidity" className="form-check-label">Feuchtigkeit</label>
                </div>
                <div className="form-check">
                    <input
                        id="cloudcover"
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedDetails.includes('cloudcover')}
                        onChange={() => handleCheckboxChange('cloudcover')}
                    />
                    <label htmlFor="cloudcover" className="form-check-label">Wolkenbedeckung</label>
                </div>
                <div className="form-check">
                    <input
                        id="conditions"
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedDetails.includes('conditions')}
                        onChange={() => handleCheckboxChange('conditions')}
                    />
                    <label htmlFor="conditions" className="form-check-label">Wetterbedingungen</label>
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weatherData.length > 0 && (
                <div className="row">
                    {weatherData.map((day) => (
                        <div className="col-md-4 mb-4" key={day.date}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{format(new Date(day.date), 'dd.MM.yyyy')}</h5>
                                    <p className="card-text">
                                        <strong>Minimale Temperatur:</strong> {day.min_temp}°C
                                    </p>
                                    <p className="card-text">
                                        <strong>Maximale Temperatur:</strong> {day.max_temp}°C
                                    </p>
                                    <p className="card-text">
                                        <strong>Regenwahrscheinlichkeit:</strong> {day.rain_chance}%
                                    </p>
                                    <p className="card-text">
                                        <strong>Windgeschwindigkeit:</strong> {day.wind_speed} km/h
                                    </p>
                                    {selectedDetails.includes('feelslike') && day.feelslike && (
                                        <p className="card-text">
                                            <strong>Gefühlte Temperatur:</strong> {day.feelslike}°C
                                        </p>
                                    )}
                                    {selectedDetails.includes('sunrise') && day.sunrise && (
                                        <p className="card-text">
                                            <strong>Sonnenaufgang:</strong> {day.sunrise}
                                        </p>
                                    )}
                                    {selectedDetails.includes('sunset') && day.sunset && (
                                        <p className="card-text">
                                            <strong>Sonnenuntergang:</strong> {day.sunset}
                                        </p>
                                    )}
                                    {selectedDetails.includes('humidity') && day.humidity !== undefined && (
                                        <p className="card-text">
                                            <strong>Feuchtigkeit:</strong> {day.humidity}%
                                        </p>
                                    )}
                                    {selectedDetails.includes('cloudcover') && day.cloudcover !== undefined && (
                                        <p className="card-text">
                                            <strong>Wolkenbedeckung:</strong> {day.cloudcover}%
                                        </p>
                                    )}
                                    {selectedDetails.includes('conditions') && day.conditions && (
                                        <p className="card-text">
                                            <strong>Wetterbedingungen:</strong> {day.conditions}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {weatherData.length > 0 && (
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-Mail-Adresse</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Gib eine E-Mail-Adresse ein"
                    />
                    <button className="btn btn-success mt-3" onClick={sendEmail}>
                        Wettervorhersage per E-Mail senden
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;

