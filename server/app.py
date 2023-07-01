from flask import Flask, jsonify, request
import json
import utils

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
    with open(file_path) as json_file:
        data = json.load(json_file)
    return jsonify(data)


@app.route('/get-backup-data', methods=['POST'])
def get_backup_data():
    requestData = request.json
    brand_name = requestData.get('brand_name')

    file_names_json = utils.get_file_names(f"backup/{brand_name}")
    print(file_names_json)

    return jsonify(file_names_json)


@app.route('/save-data', methods=['POST'])
def save_data():

    requestData = request.json
    brand_name = requestData.get('brand_name')
    file_data = requestData.get('data')
    source_directory = "data"
    file_to_copy = f"{brand_name}.json"

    new_copy_filename = utils.copy_json_file(
        source_directory,  brand_name, file_to_copy)
    file_path = f"data/{brand_name}.json"
    with open(file_path, "w") as json_file:
        json.dump(file_data, json_file)

    # ---------------------------------------------------------

    output_file_path = utils.compare_json_files(
        brand_name, f"backup/{brand_name}/{new_copy_filename}", f"data/{brand_name}.json")
    print(f"Differences saved in: {output_file_path}")
    # ------------------------------------------------------------------

    return jsonify({"message": "Data saved successfully"})


@app.route('/get-brand-list', methods=['GET'])
def get_brand_data():
    file_path = f'list.json'
    with open(file_path) as json_file:
        data = json.load(json_file)
    return jsonify(data)


if __name__ == '__main__':
    app.run()
