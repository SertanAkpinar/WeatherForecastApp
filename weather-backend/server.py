from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv('../key.env')
API_KEY = os.getenv('API_KEY')
BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'

# Existing weather route
@app.route('/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    include_hourly = request.args.get('includeHourly') == 'true'
    include_alerts = request.args.get('includeAlerts') == 'true'

    if not location or not start_date or not end_date:
        return jsonify({"error": "Location, start date, and end date are required"}), 400

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
            'humidity': day.get('humidity', 0),
        }
        
        if include_hourly:
            day_data['hourly'] = day.get('hours', [])

        result.append(day_data)

    if include_alerts:
        result.append({'alerts': data.get('alerts', [])})

    return jsonify(result)

# New email sending route
@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    to_email = data.get('email')
    location = data.get('location')
    weather_data = data.get('weather_data')

    if not to_email or not location or not weather_data:
        return jsonify({"error": "Email, location, and weather data are required"}), 400

    # Prepare email content
    email_body = f"Wettervorhersage für {location}:\n\n"
    for day in weather_data:
        email_body += f"Datum: {day['date']}\n"
        email_body += f"Minimale Temperatur: {day['min_temp']}°C\n"
        email_body += f"Maximale Temperatur: {day['max_temp']}°C\n"
        email_body += f"Regenwahrscheinlichkeit: {day['rain_chance']}%\n"
        email_body += f"Windgeschwindigkeit: {day['wind_speed']} km/h\n"
        email_body += "------------------------------\n"

    # Send email
    from_email = os.getenv('E_MAIL')
    from_password = os.getenv('CODE')
    subject = f"Wettervorhersage für {location}"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(email_body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.bht-berlin.de', 587)
        server.starttls()
        server.login(from_email, from_password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        return jsonify({"success": True, "message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)