from flask import Flask, jsonify , request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

#def emmisionbysectors():

 #   data = pd.read_csv(r'C:\Users\shaik\OneDrive\Desktop\PBL NEW\backend\indiaCo2emmisionbysectors(2022).csv')
  #  filtered_data = data[data['Industry_Type'] == 'Energy' ]

   # filtered_data.to_csv('indiaCo2emmisionENERGY(2022).csv',index=False)

#emmisionbysectors()



import pandas as pd

def piedata():
    # Correct file path
    file_path = r'C:\Users\shaik\OneDrive\Desktop\PBL UPDATED\PBL\data\indiaCo2emmisionbysectors(2022).csv'
    
    # Read the Excel file
    df = pd.read_csv(file_path)

    # Remove leading/trailing spaces from column names
    df.columns = df.columns.str.strip()

    # Print column names to debug
    print("Column names in Excel file:", df.columns.tolist())

    # Filtering data
    filtered_df = df[(df["Country"] == "India") & (df["Region"] == "Asia") & (df["Year"] == 2022)]

    # Select numerical columns except 'Year'
    numerical_columns = filtered_df.select_dtypes(include=['number']).columns
    numerical_columns = numerical_columns[numerical_columns != "Year"]  # Exclude 'Year'

    # Group by 'Industry_Type' and sum numerical columns (excluding 'Year')
    grpdata = filtered_df.groupby('Industry_Type')[numerical_columns].sum().reset_index()

    # Print output before converting to JSON
    print(grpdata)

piedata()

