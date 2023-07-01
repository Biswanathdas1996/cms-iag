import shutil
import os
import datetime
import json
from dictdiffer import diff


def create_folder(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        return folder_path
    else:
        print(f"Folder already exists: {folder_path}")
        return folder_path


def copy_json_file(source_dir, brand_name, filename):
    folder_path = create_folder(f"backup/{brand_name}")
    current_datetime = datetime.datetime.now()
    formatted_datetime = current_datetime.strftime('%Y-%m-%d_%I-%M-%S_%p')
    new_filename = f"{formatted_datetime}.json"
    source_path = os.path.join(source_dir, filename)
    dest_path = os.path.join(folder_path, new_filename)
    shutil.copyfile(source_path, dest_path)
    return new_filename


def compare_json_files(brand_name, file1_path, file2_path):
    folder_path = create_folder(f"diff/{brand_name}")
    # Load the contents of the JSON files
    with open(file1_path, 'r') as file1:
        json1 = json.load(file1)
    with open(file2_path, 'r') as file2:
        json2 = json.load(file2)

    # Compare the JSON files
    differences = list(diff(json1, json2))

    current_datetime = datetime.datetime.now()
    formatted_datetime = current_datetime.strftime('%Y-%m-%d_%I-%M-%S_%p')
    new_filename = f"{formatted_datetime}.json"

    output_path = f"diff/{brand_name}/{new_filename}.json"
    with open(output_path, 'w') as output_file:
        json.dump(differences, output_file, indent=4)

    return output_path


def get_file_names(folder_path):
    file_names = os.listdir(folder_path)
    return file_names
