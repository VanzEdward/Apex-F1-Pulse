from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
# Enable CORS so our JS frontend is allowed to fetch data from this server
CORS(app) 

# Create an endpoint that our JavaScript will call
@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    try:
        # 1. The server fetches the data from the external F1 API
        url = "https://api.jolpi.ca/ergast/f1/2026/driverStandings.json"
        response = requests.get(url)
        
        # 2. Convert it to a Python dictionary
        data = response.json()
        
        # 3. Send it cleanly back to our Vanilla JS frontend
        return jsonify(data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/constructors', methods=['GET'])
def get_constructors():
    try:
        # Fetch the official constructor standing numbers for the 2026 season
        url = "https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json"
        response = requests.get(url)
        data = response.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)