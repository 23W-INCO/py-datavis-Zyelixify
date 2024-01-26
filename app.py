from flask import Flask, jsonify, render_template
from flask import request
from datetime import datetime
from fhir.resources.patient import Patient
import json

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html') # for some reason couldn't link the js script, so had to turn it to a template

@app.route('/api/patients/<id>', methods=['GET'])
def get_patient(id):
    try:
        # Load the patients data from the JSON file
        with open('data/patients.json', 'r') as f:
            patients = json.load(f)

        # Iterate over the patients and find the one with the matching ID
        for patient_data in patients:
            if patient_data['id'] == id:
                # Create a Patient object and return it as JSON
                patient = Patient(**patient_data)
                return jsonify(patient.dict()), 200

        # If no patient with the matching ID is found, return an error
        return jsonify({"error": "Patient not found"}), 404
    except:
        return jsonify({"error": "There was an error when fetching data."}), 400
    
@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        # Load the patients data from the JSON file
        with open('data/patients.json', 'r') as f:
            patients = json.load(f)

        # Iterate over the patients and create a Patient object for each
        patient_objects = []
        for patient_data in patients:
            patient = Patient(**patient_data)
            patient_objects.append(patient)

        # Return the list of patients as JSON
        return jsonify([patient.dict() for patient in patient_objects]), 200
    except:
        return jsonify({"error": "There was an error when fetching data."}), 400
    
@app.route('/api/patients', methods=['POST'])
def add_patient():
    try:
        # Get and validate the request data
        data = request.get_json()
        if 'id' not in data or 'gender' not in data or 'birthDate' not in data:
            return jsonify({"error": "Missing required field"}), 400

        # Create a new patient
        birthDate = datetime.strptime(data['birthDate'], '%Y-%m-%d')
        new_patient = {
            'resourceType': 'Patient',
            'id': data['id'],
            'gender': data['gender'],
            'birthDate': birthDate.strftime('%Y-%m-%d')
        }

        # Load and update the JSON database
        with open('data/patients.json', 'r') as f:
            patients = json.load(f)

        # Check if patient with same id exists
        for i, patient in enumerate(patients):
            if patient['id'] == new_patient['id']:
                # Update the existing patient
                patients[i] = new_patient
                break
        else:
            # Add the new patient
            patients.append(new_patient)

        with open('data/patients.json', 'w') as f:
            json.dump(patients, f)

        # Return the new patient as JSON
        return jsonify(new_patient), 201
    except:
        return jsonify({"error": "There was an error when adding the patient."}), 400 # Error 400: Bad Request
    

if __name__ == '__main__':
    app.run(debug=True)