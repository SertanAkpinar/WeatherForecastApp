import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
                include_chart: selectedDetails.includes('chart'),
            });
            setError(null);
            alert('Wettervorhersage erfolgreich gesendet!');
        } catch (err) {
            setError('Fehler beim Senden der E-Mail.');
        }
    };

    const handleCheckboxChange = (detail: string) => {
        if (selectedDetails.includes(detail)) {
            setSelectedDetails(selectedDetails.filter(d => d !== detail));
        } else {
            setSelectedDetails([...selectedDetails, detail]);
        }
    };

    const chartData = {
        labels: weatherData.map(day => format(new Date(day.date), 'dd.MM.yyyy')),
        datasets: [
            {
                label: 'Maximale Temperatur (°C)',
                data: weatherData.map(day => day.max_temp),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Minimale Temperatur (°C)',
                data: weatherData.map(day => day.min_temp),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    return (
        <div className="container">
            <h1 className="my-4 text-center">Wettervorhersage</h1>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label>Standort:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label>Startdatum:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label>Enddatum:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
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
                </div>

                <div className="col-md-4">
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
                </div>

                <div className="col-md-4">
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
                </div>

                <div className="col-md-4">
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
                </div>

                <div className="col-md-4">
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
                </div>

                <div className="col-md-4">
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
                <div className="col-md-4">
                    <div className="form-check">
                        <input
                            id="chart"
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedDetails.includes('chart')}
                            onChange={() => handleCheckboxChange('chart')}
                        />
                        <label htmlFor="chart" className="form-check-label">Temperaturverlauf anzeigen</label>
                    </div>
                </div>
            </div>

            <button onClick={fetchWeather} className="btn btn-primary my-3">Wetterdaten abrufen</button>

            {weatherData.length > 0 && (
                <div className="my-4">
                    <h3 className="text-center">Wettervorhersage für {location}</h3>
                    <div className="row">
                        {weatherData.map((day, index) => (
                            <div key={index} className="col-md-4">
                                <div className="border p-3 my-2">
                                    <p><strong>Datum:</strong> {format(new Date(day.date), 'dd.MM.yyyy')}</p>
                                    <p><strong>Minimale Temperatur:</strong> {day.min_temp}°C</p>
                                    <p><strong>Maximale Temperatur:</strong> {day.max_temp}°C</p>
                                    <p><strong>Regenwahrscheinlichkeit:</strong> {day.rain_chance}%</p>
                                    <p><strong>Windgeschwindigkeit:</strong> {day.wind_speed} km/h</p>
                                    {day.feelslike && <p><strong>Gefühlte Temperatur:</strong> {day.feelslike}°C</p>}
                                    {day.sunrise && <p><strong>Sonnenaufgang:</strong> {day.sunrise}</p>}
                                    {day.sunset && <p><strong>Sonnenuntergang:</strong> {day.sunset}</p>}
                                    {day.humidity && <p><strong>Feuchtigkeit:</strong> {day.humidity}%</p>}
                                    {day.cloudcover && <p><strong>Wolkenbedeckung:</strong> {day.cloudcover}%</p>}
                                    {day.conditions && <p><strong>Wetterbedingungen:</strong> {day.conditions}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {selectedDetails.includes('chart') && weatherData.length > 0 && (
                <div className="mb-5">
                    <h3 className="text-center">Temperaturverlauf</h3>
                    <Line data={chartData} />
                </div>
            )}

            <div className="form-group">
                <label>E-Mail:</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <button onClick={sendEmail} className="btn btn-success my-3">Per E-Mail senden</button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
};

export default App;