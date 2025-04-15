from flask import Flask, jsonify , request, send_from_directory
import pandas as pd
from flask_cors import CORS
import openai
import google.generativeai as genai
import re
import os   
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

# Set API key
genai.configure(api_key=os.getenv("API_KEY"))

# Load the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_insights():
    """
    Fetch AI-generated insights about India's power sector and extract key points.
    """
    prompt = """
    Provide the top 4 AI-driven insights on India's power sector:
    1. Most polluting sector and its emission statistics.
    2. Best performing energy source based on sustainability.
    3. Recent government policies affecting India's power plants.
    4. Future trends in India's electricity generation.
    Format your response clearly with headings for each insight and limit it for 200 words each.
    """

    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # Improved Regex to handle multiline content properly
        insights = re.findall(r"\*\*(.*?)\*\*[:\s]*\n(.*?)(?=\n\*\*|\Z)", raw_text, re.DOTALL)

        # Format into JSON
        insights_data = [{"title": title.strip(), "content": content.strip()} for title, content in insights]
        return insights_data

    except Exception as e:
        return {"error": str(e)}    


@app.route('/get-insights', methods=['GET'])
def get_insights():
    """
    API route to get power sector insights.
    """
    insights = generate_insights()
    return jsonify({"insights": insights})

@app.route('/api/totalemmision', methods=['GET'])
def total_emmision():
    data = pd.read_csv(f'../data/Indian-Air-Pollutiionupdated.csv')
    data['Average SO2 (mg/Nm3) - 2024-25'] =pd.to_numeric(data['Average SO2 (mg/Nm3) - 2024-25'], errors='coerce')

    sumdata = data['Average SO2 (mg/Nm3) - 2024-25'].sum()

    return jsonify(sumdata)



@app.route('/api/call-emmision', methods=['GET'])
def call_emmision():
    data = pd.read_csv(f'../data/Indian-Air-Pollutiionupdated.csv')

    data['Average SO2 (mg/Nm3) - 2024-25'] = pd.to_numeric(data['Average SO2 (mg/Nm3) - 2024-25'], errors='coerce')
    grouped_data = data.groupby('State')['Average SO2 (mg/Nm3) - 2024-25'].sum().reset_index()
    grouped_data = grouped_data.nlargest(5,'Average SO2 (mg/Nm3) - 2024-25')
    response = grouped_data.to_dict(orient='records')


    #print(response)
    return jsonify(response)


@app.route('/api/call-emmisionofstates', methods=['GET'])
def call_emmisionall():
    data = pd.read_csv(f'../data/Indian-Air-Pollutiionupdated.csv')

    data['Average SO2 (mg/Nm3) - 2024-25'] = pd.to_numeric(data['Average SO2 (mg/Nm3) - 2024-25'], errors='coerce')
    grouped_data = data.groupby('State')['Average SO2 (mg/Nm3) - 2024-25'].sum().reset_index()
    response = grouped_data.to_dict(orient='records')


    #print(response)
    return jsonify(response)


@app.route('/api/totalplants', methods=['GET'])
def total_plants():
    data = pd.read_csv(f'../data/Indian-Air-Pollutiion.csv')
    total_entries = data.iloc[-1, 0]
    return jsonify(int(total_entries))


@app.route('/api/totalpiechart')
def piedata():
    # Correct file path and method
    file_path = f'../data/indiaCo2emmisionbysectors(2022).csv'
    
    # Read the Excel file
    df = pd.read_csv(file_path)

    # Remove leading/trailing spaces from column names
    df.columns = df.columns.str.strip()

    # Print column names to debug
    #print("Column names in Excel file:", df.columns.tolist())

    # Filtering data
    filtered_df = df[(df["Country"] == "India") & (df["Region"] == "Asia") & (df["Year"] == 2022)]

    # Select numerical columns except 'Year'
    numerical_columns = filtered_df.select_dtypes(include=['number']).columns
    numerical_columns = numerical_columns[numerical_columns != "Year"]  # Exclude 'Year'

    # Group by 'Industry_Type' and sum numerical columns (excluding 'Year')
    grpdata = filtered_df.groupby('Industry_Type')[numerical_columns].sum().reset_index()

    pie_chart_data = grpdata[['Industry_Type', 'Co2_Emissions_MetricTons']].to_dict(orient='records')
    return jsonify(pie_chart_data)

    



@app.route('/api/total-capacity-by-state', methods=['GET'])
def total_capacity_by_state():
    # Load your CSV file
    data = pd.read_csv(f'../data/Indian-Air-Pollutiion.csv')
    #print("request get initialized!!")
    # Group data by State and calculate the total capacity
    grouped_data = data.groupby('State')['Total Capacity'].sum().reset_index()
    print(grouped_data)
    # Convert the grouped data to JSON
    response = grouped_data.to_dict(orient='records')
    return jsonify(response)
# Define the route to get data
@app.route('/api/chart-data', methods=['GET'])

def get_chart_data():
    # Read CSV file
    df = pd.read_csv('../data/RS_Session_259_AU_2120_B_and_C.csv')  # replace with the correct file path

    # Extract relevant columns (you can adjust this based on your need)
    data = df[['Year', 'Total Import (MT)', 'Coal Based Generation (in MU)']].to_dict(orient='records')
    
    # Print the data to the console
    #print("Data received:", data)

    # Send the data to frontend
    return jsonify(data)

@app.route('/api/state-data', methods=['GET'])
def get_state_data():
    state_name = request.args.get('state', 'Maharashtra')  # Default to Maharashtra
    file_path = f'../data/Indian-Air-Pollutiion.csv'  # Replace with your file path
    
    # Load data
    data = pd.read_csv(file_path)
    
    # Clean the data: Remove leading/trailing whitespaces in column names and state values
    data.columns = data.columns.str.strip()
    data['State'] = data['State'].str.strip().str.title()  # Clean the 'State' column
    
    # Handle missing values for 'SO2 Norms (mg/Nm3)' column
    data['SO2 Norms (mg/Nm3)'] = data['SO2 Norms (mg/Nm3)'].fillna(0)  # Replace NaN with 0
    
    # Filter data by state
    data = data[data['State'] == state_name]
    
    # Group and summarize data for pie chart
    grouped_data = data.groupby('Name of Project')['SO2 Norms (mg/Nm3)'].sum().reset_index()
    # Convert to JSON and return the result
    result = grouped_data.to_dict(orient='records')
    return jsonify(result)

REPORTS_DIR = os.path.join(os.getcwd(), "../data", "")
@app.route("/reports/<int:report_id>/download")
def download_report(report_id):
    format = request.args.get("format", "pdf")  # Default format is PDF
    filename = f"Co2_Emissions_by_Sectors.csv"
    file_path = os.path.join(REPORTS_DIR, filename)
    print(file_path)
    print(filename)

    # Check if file exists
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # Serve the file for download
    return send_from_directory(REPORTS_DIR, filename, as_attachment=True)


@app.route("/abc")
def abc():
    print("------------------------------------")
    
    return jsonify({"message": "Hello, World!"})
    
if __name__ == '__main__':
    app.run(debug=True)
