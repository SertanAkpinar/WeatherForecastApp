## Voraussetzung damit das basic Verzeichnis funktioniert:
in der key.env: 
- persönlichen API_KEY von https://www.visualcrossing.com eingeben
- E_MAIL Adresse eingeben von der versendet werden soll
- CODE Passwort der Email Adresse eingeben
wichtig: Es darf kein Email Server mit 2 Faktor Authentifizierung sein
- in Zeile 76 kann man die Email Adresse des Empfängers einfügen. (Default ist, das der Versender die Mail selber bekommt.)

in das Verzeichnis wechseln - cd basic
im Terminal diesen Befehl eingeben: 
python CodingChallenge.py 


## Voraussetzung damit die WebApp funktioniert 

- nodejs muss auf dem PC installiert sein

Außerdem müssen diese Befehle im Terminal eingegeben werden:
- pip install python-dotenv flask flask-cors
- npm install axios bootstrap date-fns chart.js react-chartjs-2
Damit die nötigen Bibliotheken installiert werden.

Man benötigt jetzt 2 Terminals.

#### Terminal 1
Diese Befehle nacheinander im Terminal eingeben:
- cd weather-frontend
- npm install (lädt alle nötigen packages herunter(node_modules))
- npm run dev (startet das Frontend und man kann den Link in der Konsole anklicken)

#### Terminal 2
Diese Befehle nacheinander im Terminal eingeben:
- cd weather-backend
- python server.py
