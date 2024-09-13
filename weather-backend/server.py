from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

load_dotenv('../key.env')
API_KEY = os.getenv('API_KEY')
BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'

@app.route('/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    include_hourly = request.args.get('includeHourly') == 'true'
    include_alerts = request.args.get('includeAlerts') == 'true'

    if not location or not start_date or not end_date:
        return jsonify({"error": "Location, start date and end date are required"}), 400

    # Build URL based on selected options
    options = []
    if include_hourly:
        options.append("include=hours")
    if include_alerts:
        options.append("include=alerts")

    options_str = "&".join(options)
    url = f"{BASE_URL}{location}/{start_date}/{end_date}?unitGroup=metric&key={API_KEY}&contentType=json&{options_str}"
    
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data"}), response.status_code

    data = response.json()
    forecast = data.get('days', [])

    result = []
    for day in forecast:
        day_data = {
            'date': day['datetime'],
            'min_temp': day['tempmin'],
            'max_temp': day['tempmax'],
            'rain_chance': day.get('precipprob', 0),
            'wind_speed': day['windspeed'],
            'humidity': day.get('humidity', 0),  # Optional field
        }
        
        # Add hourly data if requested
        if include_hourly:
            day_data['hourly'] = day.get('hours', [])

        result.append(day_data)

    # Include alerts if requested
    if include_alerts:
        result.append({'alerts': data.get('alerts', [])})

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)