from flask import Flask, jsonify, render_template
from fhir.resources.patient import Patient
import json

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html') # for some reason couldn't link the js script, so had to turn it to a template

@app.route('/patient/<id>', methods=['GET'])
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
    
@app.route('/patients', methods=['GET'])
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

if __name__ == '__main__':
    app.run(debug=True)