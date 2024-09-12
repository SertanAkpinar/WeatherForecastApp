from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', 'Berlin')
    start_date = request.args.get('startDate', None)
    end_date = request.args.get('endDate', None)
    
    API_KEY = os.getenv('API_KEY')
    URL = f'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{city}/{start_date}/{end_date}?unitGroup=metric&key={API_KEY}&contentType=json'
    
    try:
        response = requests.get(URL)
        
        # Überprüfe den Statuscode der API-Antwort
        if response.status_code != 200:
            return jsonify({"error": f"Fehler von der Wetter-API: {response.status_code}"}), 500
        
        # Versuche, die Antwort als JSON zu parsen
        try:
            data = response.json()
        except requests.exceptions.JSONDecodeError:
            return jsonify({"error": "Fehler beim Verarbeiten der API-Antwort. Ungültiges JSON."}), 500
        
        forecast = []
        for day in data.get('days', []):
            forecast.append({
                'date': day['datetime'],
                'min_temp': day['tempmin'],
                'max_temp': day['tempmax'],
                'rain_chance': day.get('precipprob', 0),
                'wind_speed': day['windspeed']
            })
        
        return jsonify(forecast)
    
    except Exception as e:
        return jsonify({"error": f"Ein interner Fehler ist aufgetreten: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
