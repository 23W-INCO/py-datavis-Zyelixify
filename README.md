# Patient Data Visualization App

## Overview
This application uses a Python backend with Flask to serve FHIR-compliant patient data through an API. It also serves as a website that visualizes the patients' basic demographic data using D3.js. The data used in this project was generated by [Synthea](https://github.com/synthetichealth/synthea).

The data was then filtered to only include basic patient demographics data and not diving into their full medical history. As an example use-case, visualization of the patients' age groups and genders are shown in a diverging stacked-bar chart, which highlights the exact number of patients in each group/of which gender in a tooltip when hovering over the bars - with the ability to manipulate the chart by adding simple patient records into the dataset.

## Getting Started
This project can be launched quickly and easily using GitHub Codespaces.

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
- ```GET: /api/patients/<id>``` - Returns a single patient with the given id
- ```GET: /api/patients``` - Returns a list of all patients
- ```POST: /api/patients``` - Submit a basic patient record to the database
