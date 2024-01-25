# Patient Data Visualization App

## Overview
This application uses a Python backend with Flask to serve FHIR compliant patient data through an API. It also serves a website that visualizes the patients' basic demographics data using D3.js.

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Flask
- D3.js

### Installation
1. Clone the repository
2. Install the required packages
```pip install -r requirements.txt```
3. Start the server by running
```python app.py```

### API 
The following endpoints are available:
- ```/api/patients``` - Returns a list of all patients
- ```/api/patients/<id>``` - Returns a single patient with the given id

