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

export default App;