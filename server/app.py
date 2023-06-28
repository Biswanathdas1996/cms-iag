from flask import Flask, jsonify, request
import json

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response


@app.route('/get-data', methods=['POST'])
def get_data():
    requestData = request.json
    brand_name = requestData.get('brand_name')
    file_path = f'data/{brand_name}.json'

    # Open the JSON file and load the data
    with open(file_path) as json_file:
        data = json.load(json_file)

    # Return the data as a JSON response
    return jsonify(data)


@app.route('/save-data', methods=['POST'])
def save_data():
    # Get the JSON data from the request body
    # data = request.get_json()
    requestData = request.json
    brand_name = requestData.get('brand_name')
    file_data = requestData.get('data')

    # Specify the file path where you want to save the JSON data
    file_path = f"data/{brand_name}.json"

    # Open the file in write mode and use json.dump() to write the data
    with open(file_path, "w") as json_file:
        json.dump(file_data, json_file)

    # Return a success message as the response
    return jsonify({"message": "Data saved successfully"})


@app.route('/get-brand-list', methods=['GET'])
def get_brand_data():
    file_path = f'list.json'
    with open(file_path) as json_file:
        data = json.load(json_file)
    return jsonify(data)


if __name__ == '__main__':
    app.run()
