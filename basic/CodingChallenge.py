import os
from dotenv import load_dotenv # type: ignore
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

load_dotenv('../key.env')
API_KEY = os.getenv('API_KEY')
LOCATION = 'Berlin'
URL = f'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{LOCATION}/next14days?unitGroup=metric&key={API_KEY}&contentType=json'

response = requests.get(URL)
data = response.json()

forecast = data['days']

email_body = f"14-Tage Wettervorhersage für {LOCATION}:\n\n"

print(f"\n14-Tage Wettervorhersage für {LOCATION}:\n")
for day in forecast:
    date = day['datetime']
    min_temp = day['tempmin']
    max_temp = day['tempmax']
    rain_chance = day.get('precipprob', 0)
    wind_speed = day['windspeed']
    
    print(f"Datum: {date}")
    print(f"Minimale Temperatur: {min_temp}°C")
    print(f"Maximale Temperatur: {max_temp}°C")
    print(f"Regenwahrscheinlichkeit: {rain_chance}%")
    print(f"Windgeschwindigkeit: {wind_speed} km/h")
    print("------------------------------")

    email_body += f"Datum: {date}\n"
    email_body += f"Minimale Temperatur: {min_temp}°C\n"
    email_body += f"Maximale Temperatur: {max_temp}°C\n"
    email_body += f"Regenwahrscheinlichkeit: {rain_chance}%\n"
    email_body += f"Windgeschwindigkeit: {wind_speed} km/h\n"
    email_body += "------------------------------\n"

html_content = f"""
<html>
<body>
<h1>14-Tage Wettervorhersage für {LOCATION}</h1>
<ul>
"""

for day in forecast:
    html_content += f"<li>{day['datetime']}: Min Temp: {day['tempmin']}°C, Max Temp: {day['tempmax']}°C, Regenwahrscheinlichkeit: {day['precipprob']}%, Windgeschwindigkeit: {day['windspeed']} km/h</li>"

html_content += "</ul></body></html>"

with open("wettervorhersage.html", "w") as file:
    file.write(html_content)

print("\nDie Wettervorhersage wurde in der Datei 'wettervorhersage.html' gespeichert.")

def send_email(subject, body, to_email):
    from_email = os.getenv('E_MAIL')
    from_password = os.getenv('CODE')
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.bht-berlin.de', 587)
    server.starttls()
    server.login(from_email, from_password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()

to_email = os.getenv('E_MAIL')
send_email(f"14-Tage-Wettervorhersage für {LOCATION}", email_body, to_email)

print("\nDie Wettervorhersage wurde erfolgreich per E-Mail gesendet.")