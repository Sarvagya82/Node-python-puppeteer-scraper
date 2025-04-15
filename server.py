from flask import Flask, jsonify, send_from_directory
import json
import os

app = Flask(__name__)
data_file = 'scraped_data.json'

@app.route('/') # Define the endpoint [cite: 17]
def get_scraped_data():
    """Reads the scraped data from JSON and serves it."""
    try:
        # Read the JSON data file [cite: 16]
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data) # Return as JSON [cite: 17]
    except FileNotFoundError:
        return jsonify({"error": f"Data file '{data_file}' not found. Was the scrape successful?"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": f"Could not decode JSON from '{data_file}'."}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    # Run the app, listening on all interfaces, port 5000 [cite: 18]
    app.run(host='0.0.0.0', port=5000)
