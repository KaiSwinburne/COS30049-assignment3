# Weather Blog - Machine Learning project for weather prediction project Setup Guide
This guide will walk you through the environmental setup and configuration of all resources necessary to run our website.


## Table of contents
[Installing Python](#installing-python)
[Installing Nodejs](#installing-nodejs)
[File Structure](#file-structure)
[Installing Required Libraries](#installing-required-libraries)
[Running the Website](#running-the-website)
[Configuration of AI Model Integration](#configuration-of-ai-model-integration)
[Model.py Details & Configuration steps](#modelpy-details--configuration-steps)

## Installing Python
[Back to contents ↑](#table-of-contents)<br>
1. Download Python from [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. Once downloaded, run the installer. Ensure that **“Add python.exe to PATH”** is selected on the main screen, and then press **“Install Now”**.
3. To check that Python is properly installed, open the Run menu by pressing `WIN + R`, and type in:

   ```bash
   python -V
   ```

   If Python is installed, the version number will be displayed on the screen.

## Installing Node.js
[Back to contents ↑](#table-of-contents)<br>

### For Mac:

1. Check for Homebrew Installation. In the terminal, run:

   ```
   brew --version
   ```

2. If Homebrew isn’t installed, install it:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. Now with Homebrew installed, install Node.js:

   ```bash
   brew install node
   ```

4. Verify Node.js and npm installation:

   ```bash
   node --version
   npm --version
   ```

### For Windows:

1. Download Node.js from [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager).
2. Install Node.js from the webpage. After installation, open the Command Prompt or PowerShell and verify Node.js and npm are installed correctly:

   ```bash
   node --version
   npm --version
   ```

## File Structure
[Back to contents ↑](#table-of-contents)<br>

Before proceeding, the project directory must be set up. Provided are two separate folders, **“assignment-3.zip”** for front-end React components and **“backend.zip”** for back-end components including FastAPI app and AI components. 
Unzip the contents using 7zip or Winrar of **“assignment-3.zip”** to your desired location. Now, unzip **“backend.zip”** and place that folder withinvthe same directory. The file structure should be as follows:

```
assignment-3
   ├── (installed libraries)
   └── src
      ├── (front-end components)
      ├── App.js
      └── Index.js
backend
   ├── main.py
   ├── model.py
   └── (backend components)
```

## Installing Required Libraries
[Back to contents ↑](#table-of-contents)<br>
1. To install the libraries required for this project, open a terminal window and navigate to the project directory.
2. Once here, run the following commands:

   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql pandas numpy joblib xgboost
   pip install -U scikit-learn
   npm install recharts paparse
   npm install axios chart.js react-chartjs-2
   npm install @mui/material @emotion/react @emotion/styled
   ```

## Running the Website
[Back to contents ↑](#table-of-contents)<br>
With all the required libraries installed, the website is now ready to be run. 

1. Start by navigating to the backend folder. Run FastAPI server with:

   ```bash
   uvicorn main:app --reload
   ```

2. To run the front end of the page, navigate to the root project directory, then run the command:

   ```bash
   npm start
   ```

   This will launch the front end of the webpage in your default browser.

   NOTE:
If you are receiving errors during API requests, make sure that your local web server and FastAPI server are running on the correct ports. The values stated in the files are the default port numbers, however they can change if other instances of local servers are also running. If this error is occurring, ensure that all local server instances are terminated before attempting to run the Web Server and FastAPI server.


## Configuration of AI Model Integration
[Back to contents ↑](#table-of-contents)<br>
This website is split into two different sides: the front end, which is publicly accessible and what users directly interact with, and the backend, which is where the AI models are stored and run. When a user connects to the website, they will only ever see the publicly accessible front end.

In order to enable the use of our previously developed AI models, a bridge has to be made between these two halves. This bridge is **FastAPI**.

- Running in the backend is a FastAPI server. Whenever the front end needs to retrieve data from or access the machine learning model, it generates a request which gets sent to the FastAPI server endpoint.
The required libraries in the main FastAPI app:
```py
# Import required modules
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from model import ModelManager # Import the machine learning model class
from fastapi.responses import FileResponse #NEW
import os
```

- Once here, it activates the **“main.py”** script within the backend, which determines exactly what to do based on the request it receives.
  - If it is a simple database query, it reads it and sends the response back.
  - If it is a machine model query, it calls **“model.py”** and activates the relevant model.
  - Once the model has generated an answer, this is then sent back through FastAPI to be displayed on the front end.

```py
#dict of data to be stored
model_instances = {} #ML models
model_actual_target_data = {} #target to be predicted
model_actual_feature_data = {} #features in the ML models
models = ["ridge_regression","random_forest_classifier","XGBoost_regression"]

#run when first instantiated
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    for model_type in models:
        model_instances[model_type] = ModelManager.return_model(model_type)
        #train it and retrieve info following the order in model: sunshine -> maxTemp
        model_actual_feature_data[model_type], model_actual_target_data[model_type] = model_instances[model_type].train()
    yield
    # Clean up the ML models and release the resources
    model_instances.clear()

# Instantiate the FastAPI application
app = FastAPI(lifespan=lifespan)

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to the frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the path to the dataset
dataset_path = os.path.join("./AUSweather_dataset_processed.csv") #NEW

@app.get("/dataset/") # NEW
async def get_dataset():
    """
    Endpoint to serve the entire dataset file as if it were in the public folder.
    """
    return FileResponse(dataset_path, media_type="text/csv", filename="AUSweather_dataset_processed.csv")

#predict the maxTemp using Ridge Regression
@app.get("/predict/ridge_regression/{rainFall}/{evaporation}/{sunshine}/{humidity9am}/{humidity3pm}/{windGustSpeed}/{minTemp}/{samplesize}")
async def predict(rainFall: float, evaporation: float, sunshine:float, humidity9am:float, humidity3pm: float, windGustSpeed: float, minTemp: float, samplesize:int):
    try:
        #get the model
        model = model_instances["ridge_regression"]
        target_actual_data = model_actual_target_data["ridge_regression"]
        feature_actual_data = model_actual_feature_data["ridge_regression"] 

        #change the format of humidity values to fit the models
        formatted_humidity9am = humidity9am/100
        formatted_humidity3pm = humidity3pm/100
        #make prediction
        maxTempPrediction = model.predict(rainFall, evaporation, sunshine, minTemp, formatted_humidity9am, formatted_humidity3pm, windGustSpeed)[0]
        return {"predicted_maxTemp": round(maxTempPrediction, 2),
                "actual_maxTemp": target_actual_data[:samplesize-1].tolist(), #we want to reserve the last spot in the array for the prediction value
                "actual_sunshine": feature_actual_data[:samplesize-1].tolist()
                }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

#predict the cloud condition at 9am using Random Forest Classifier
@app.get("/predict/random_forest_classifier/{rainFall}/{evaporation}/{sunshine}/{humidity9am}/{Temp9am}/{WindSpeed9am}")
async def predict(rainFall: float, evaporation:float, sunshine:float, humidity9am:float, Temp9am:float, WindSpeed9am:float):
    try:
        #get the model
        model = model_instances["random_forest_classifier"]
        support_score = model_actual_feature_data["random_forest_classifier"] 
        labels = model_actual_target_data["random_forest_classifier"]

        #change the format of humidity values to fit the models
        formatted_humidity9am = humidity9am/100

        #make prediction
        cloud9am = model.predict(rainFall,evaporation,sunshine,formatted_humidity9am,Temp9am,WindSpeed9am)[0]
        return {"predicted_cloud9am": cloud9am,
                "support_score": support_score,
                "labels": labels
                }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/predict/XGBoost/{RRP}/{SolarExposure}/{MaxTemp}/{frac_at_neg_RRP}/{RRP_negative}/{Rainfall}/{minTemp}/{samplesize}")
async def predict(RRP: float, SolarExposure: float, MaxTemp:float, frac_at_neg_RRP:float, RRP_negative: float, Rainfall: float, minTemp: float, samplesize:int):
    try:
        #get the model
        model = model_instances["XGBoost_regression"]
        target_actual_data = model_actual_target_data["XGBoost_regression"]
        feature_actual_data = model_actual_feature_data["XGBoost_regression"] 

        #make prediction
        totalDemand = model.predict(RRP, SolarExposure, MaxTemp, frac_at_neg_RRP, RRP_negative, Rainfall, minTemp)[0]
        return {"predicted_totalDemand": round(totalDemand,2),
                "actual_totalDemand": target_actual_data[:samplesize-1].tolist(),
                "actual_maxTempxg": feature_actual_data[:samplesize-1].tolist()
                }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

#Update the sample size of the chart in ridge regression
@app.put("/predict/ridge_regression/{samplesize}")
async def update_sample(samplesize:int):
    try:
        target_actual_data = model_actual_target_data["ridge_regression"]
        feature_actual_data = model_actual_feature_data["ridge_regression"] 
        return{
            "actual_maxTemp": target_actual_data[:samplesize-1].tolist(), #we want to reserve the last spot in the array for the prediction value
            "actual_sunshine": feature_actual_data[:samplesize-1].tolist()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    
#Update the sample size of the chart in ridge regression
@app.put("/predict/XGBoost/{samplesize}")
async def update_sample(samplesize:int):
    try:
        target_actual_data = model_actual_target_data["XGBoost_regression"]
        feature_actual_data = model_actual_feature_data["XGBoost_regression"] 
        return{
            "actual_totalDemand": target_actual_data[:samplesize-1].tolist(), #we want to reserve the last spot in the array for the prediction value
            "actual_maxTempxg": feature_actual_data[:samplesize-1].tolist()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```


## Model.py Details & Configuration steps:
[Back to contents ↑](#table-of-contents)<br>
*model.py* is a Python program that trains a machine learning model and produces an output, which can be returned to another file. It is written in a way to take a set of inputs (model type and parameters) and then produce a relevant output. This allows the user to select which model they wish to run based on the web page, and only the processing for that model is done.

Here are the steps to setup the model.py:

1. Import the necessary libraries:
```py
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler, FunctionTransformer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from abc import ABC, abstractmethod
from sklearn.metrics import root_mean_squared_error,classification_report, mean_squared_error, r2_score, accuracy_score, confusion_matrix, silhouette_score, ConfusionMatrixDisplay
import xgboost as xg  # Importing XGBoost
```

2. Create an abstract class that all the ML models would inherit. This class would have 2 main functions: train() and predict().
```py
class BaseModel:
    def __init__(self):
        self.model = None
        self.normalizer = None

    @abstractmethod
    def train(self):
        pass

    @abstractmethod
    def predict(self):
        pass
```

3. Create the different classes of the three machine learning models: Ridge Regression, Random Forest Classifier and XGBoost. Each with an initiated model and standardiser.
```py
class RegressionModel(BaseModel):
    def __init__(self):
        super().__init__
        self.model = Ridge()
        self.normalizer = StandardScaler()
    
    def train(self):
        dataset = pd.read_csv('./AUSweather_dataset_processed.csv')
        features = dataset [['Rainfall(mm)','Evaporation(mm/day)','Sunshine(hours/day)','MinTemp(*C)','Humidity9am(%)','Humidity3pm(%)','WindGustSpeed(km/h)']]
        target = dataset['MaxTemp(*C)']

        # Split the dataset into training and testing sets with the rate 80/20
        x_train, x_test, y_train, y_test = train_test_split(features,target,test_size=0.2,random_state=42)

        #standardisation of values 
        self.normalizer = StandardScaler()
        x_train_scaled = self.normalizer.fit_transform(x_train)
        x_test_scaled = self.normalizer.transform(x_test)

        #train
        self.model.fit(x_train_scaled, y_train)

        # Save the model
        joblib.dump(self.model, 'ridge_regression_model.pkl')

        #Predict the MaxTemp values for test set
        y_pred = self.model.predict(x_test_scaled)

        #return the actual values of sunshine and MaxTemp
        return x_test['Sunshine(hours/day)'].values, y_test.values
    
    def predict(self, rainfall, evaporation, sunshine, mintemp, humidity9am, humidity3pm, windgustspeed):
        # Load the model
        model = joblib.load('ridge_regression_model.pkl')

        # Make a prediction based on input
        return model.predict([[rainfall, evaporation, sunshine, mintemp, humidity9am, humidity3pm, windgustspeed]])
    
class RandomForestClassifierModel(BaseModel):
    def __init__(self):
        super().__init__
        self.model = RandomForestClassifier(n_estimators=500, max_depth=9, random_state=42)
        self.normalizer = FunctionTransformer(np.log1p, validate=True)

    def train(self):
        dataset = pd.read_csv('./AUSweather_dataset_processed.csv')
        #Extract features and target
        features = dataset[['Rainfall(mm)','Evaporation(mm/day)','Sunshine(hours/day)',
                                            'Humidity9am(%)','Temp9am(*C)',
                                            'WindSpeed9am(km/h)']]
        target = dataset['Cloud9amBinned']

        # Split the dataset into training and testing sets with the rate 80/20
        x_train, x_test, y_train, y_test = train_test_split(features,target,test_size=0.2,random_state=42)

        x_train_scaled = self.normalizer.fit_transform(x_train)
        x_test_scaled = self.normalizer.transform(x_test)

        #train
        self.model.fit(x_train_scaled, y_train)

        # Save the model
        joblib.dump(self.model, 'random_forest_classifier_model.pkl')

        # Predict the Cloud9am values for the test set
        y_pred = self.model.predict(x_test_scaled)

        #get the report from the prediction model
        categories = ['BKN','FEW','OVC','SCT','SKC']
        ml_report_dict = classification_report(y_test, y_pred,output_dict=True,zero_division=1)

        #get only the support score dictionary with the label from categories
        support = {label: metrics['support'] for label, metrics in ml_report_dict.items() if label in categories}

        return support,categories


    def predict(self,rainFall,evaporation,sunshine,humidity9am,Temp9am,WindSpeed9am):
        # Load the model
        model = joblib.load('random_forest_classifier_model.pkl')

        # Make a prediction based on input
        return model.predict([[rainFall,evaporation,sunshine,humidity9am,Temp9am,WindSpeed9am]])

class XGBoostRegressionModel(BaseModel):
    def __init__(self):
        super().__init__
        self.model = xg.XGBRegressor(objective ='reg:squarederror', n_estimators = 10) 
        self.normalizer = StandardScaler()
    def train(self):
        dataset = pd.read_csv('./melbourne_electricity_demand_processed.csv')

        #Extract features and target
        features = dataset[['RRP($/MWh)','SolarExposure(MJ/m^2)','MaxTemp(*C)','MinTemp(*C)','frac_at_neg_RRP','RRP_negative($/MWh)','Rainfall(mm)']]
        target = dataset['Total_demand(MWh)']

        # Split the dataset into training and testing sets with the rate 80/20
        x_train, x_test, y_train, y_test = train_test_split(features,target,test_size=0.2,random_state=42)

        #standardisation of values 
        normalizer = StandardScaler()
        x_train_scaled = normalizer.fit_transform(x_train)
        x_test_scaled = normalizer.transform(x_test)

        #train
        self.model.fit(x_train_scaled, y_train)

        # Save the model
        joblib.dump(self.model, 'XGBoost_regression_model.pkl')

        #Predict the MaxTemp values for test set
        y_pred = self.model.predict(x_test_scaled)

        #return the actual values of Actual MaxTemp and TotalDemand
        return x_test['MaxTemp(*C)'].values, y_test.values
    
    def predict(self, RRP, SolarExposure, MaxTemp, frac_at_neg_RRP, RRP_negative, Rainfall, minTemp):
        # Load the model
        model = joblib.load('ridge_regression_model.pkl')

        # Make a prediction based on input
        return model.predict([[RRP, SolarExposure, MaxTemp, frac_at_neg_RRP, RRP_negative, Rainfall, minTemp]])
```

4. Create a ModelManager class. This class is what the FastAPI app would initiate to retrieve the models based on the ones required.
```py
class ModelManager():
    """Create the models and return them"""
    @staticmethod
    def return_model(type: str) -> BaseModel:
        models = {'ridge_regression': RegressionModel,
                  'random_forest_classifier':RandomForestClassifierModel,
                  'XGBoost_regression':XGBoostRegressionModel}

        #check if the model requested is in the manager
        if type not in models:
            raise ValueError("Invalid type")
        
        #return the model it self
        return models[type]()
```

5. The code below is to test if all the models have been successfully set up when running the model.py file

```py
if __name__ == "__main__":
    #Intial training
    models = ['ridge_regression','random_forest_classifier','XGBoost_regression']
    for model in models:
        try: 
            model = ModelManager.return_model(model)
            metrics = model.train()
            print(f"Training metrics: {metrics}")

        except Exception as e:
            print(f"Error in training {model} model: {str(e)}")

    print("\nTraining completed!")
```

## Credits
Developed and maintained by:
1. Thanh Tai Tran
2. Christian van der Merwe
3. Mohammad Khalid