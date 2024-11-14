from flask import Flask, request, make_response, Response
from flask_cors import CORS
import json
import csv
import os
from datetime import datetime, timedelta

# APP init
app = Flask(__name__)

# Cross orgins
CORS(app, origins=[
   "http://127.0.0.1:5500", # Locol-host
])

# Begining of the file path (relative) for the logs
LOG_FILE_STEM = "logs/log-"

"""
   USER / ADMIN

   Add to a log to a log file

   POST - 
      name: Name of the user to log
      time: Time of the log
      instr: Instruction for the log (SIGNIN or SIGNOUT)
      date: Date of the log / filename
"""
@app.route('/log', methods=['POST'])
def log():

   # Get the post data
   data = request.json
   
   # Create the file if not already created
   open(LOG_FILE_STEM + data["date"] + ".csv", "a")

   # Create the log line
   # name,time,instruction(signin or signout)
   log = f"{data['name']},{data["time"]},{data['instr']}\n"

   # Write the log to the file
   # File stem + the date givin by the post data is the file name
   with open(LOG_FILE_STEM + data["date"] + ".csv", "a") as f: 
      f.write(log)

   # Return an empty response
   return Response()

"""
   USER / ADMIN

   Check if a user is signed in

   POST -
      uname: Name of the user to check if signed in

   Response -
      {
         isSignedIn: True / False
         time: Time signed in at
         date: date signed in on
      }
"""
@app.route("/isSignedIn", methods=["POST"])
def getUserLoggedIn():

   # Get the post data
   data = request.json

   # Create a list of all date names in the logs, sorted from newest to oldest
   dateList = os.listdir("./logs")
   dateList.sort(key=lambda date: datetime.strptime(date, "log-%Y-%m-%d.csv"), reverse=True)

   # Loop every filename in the datelist
   for fileName in dateList:
      
      # Open the current file
      with open(os.path.join("./logs", fileName)) as file:
         
         # Create a csv file reader that is bottom to top
         csvFile = reversed(list(csv.reader(file, delimiter=',', quotechar='|')))

         # Loop every row in the csv
         for row in csvFile:

            # If the user is correct on the line
            if row[0] == data["uname"]:

               # If they signed in last
               if row[2] == "SIGNIN":
                  
                  # Return our final data with true / valid values
                  return Response(json.dumps({"isSignedIn": "True", "time": row[1], "date": fileName[4:-4]}))
               
               # If they signed out last
               elif row[2] == "SIGNOUT":

                  # Return our final data with false / null values
                  return Response(json.dumps({"isSignedIn": "False", "time": None, "date": None}))
               
   # Return false / null values if no instructions were met
   return Response(json.dumps({"isSignedIn": "False", "time": None, "date": None}))
            

"""
   Admin

   Returns the data for the admin

   POST -
      date: Date to get the activity log on

   Response -
   {
      activityLog: activity log list of the day
      totalTimes: total times of the users over all logs
      currentlySignedIn: list of every user that hasn't signed out over all logs
   }
"""
@app.route('/admin', methods=['POST'])
def getSignedIn():

   # Data that will be the final response
   # Holds dicts for the activity log and total times
   data = {
      "activityLog": [],
      "totalTimes": {},
      "currentlySignedIn": []
   }

   # Create the file if not already created
   open(LOG_FILE_STEM + request.json["date"] + ".csv", "a")



   # ACTIVITY LOG
   # Open the file specified by the get request's date
   with open(LOG_FILE_STEM + request.json["date"] + ".csv") as file:

      # Create a csv file reader
      csvFile = csv.reader(file, delimiter=',', quotechar='|')

      # Loop every row in the csv
      for row in csvFile:

         # Add the data to the activityLog for the thing
         # name, time, instruction
         data["activityLog"].append({"name": row[0], "time": row[1], "instr": row[2]})



   # Everything else

   # Hold a dict for all the times signed in 
   timesSignedIn = {}

   # Create a list of all date names in the logs, sorted from newest to oldest
   dateList = os.listdir("./logs")
   dateList.sort(key=lambda date: datetime.strptime(date, "log-%Y-%m-%d.csv"))

   # Add the total times up with every file
   # Iterate over files in directory
   for fileName in dateList:
      
      # Open file
      with open(os.path.join("./logs", fileName)) as file:
         
         # Create a csv file reader
         csvFile = csv.reader(file, delimiter=',', quotechar='|')

         # Loop every row in the csv
         for row in csvFile:

            # Get a split time from the row
            splitTime = row[1].split(":")

            # Get the split day
            splitDay = fileName[4:-4].split("-")

            # Get the datetime object for math
            time = datetime(int(splitDay[0]), int(splitDay[1]), int(splitDay[2]), int(splitTime[0]), int(splitTime[1]), int(splitTime[2]))
            
            # If the user is signing in
            if row[2] == "SIGNIN":

               # Set the name as a key and the datetime object to mark for later
               timesSignedIn[row[0]] = time
               data["currentlySignedIn"].append(row[0])
            
            elif row[2] == "SIGNOUT":

               # Get the time difference between the time of signin and now
               timeSignedInFor = time - timesSignedIn[row[0]]

               # Check to see if the name is in the data
               if row[0] not in data["totalTimes"]:

                  # If not initialize it with 0 value to add to later
                  data["totalTimes"][row[0]] = timedelta(0, 0, 0, 0, 0, 0, 0)

               # Now add the time signed in for to the data
               data["totalTimes"][row[0]] += timeSignedInFor

               data["currentlySignedIn"].remove(row[0])

   # Loop the totalTimes to turn the timedeltas to strings
   for name in data["totalTimes"]:
      data["totalTimes"][name] = str(data["totalTimes"][name])

   # Construct a response and return it in a json format
   return Response(json.dumps(data))

"""
   Admin

   Returns every date from every log filename

   GET

   Response - List of all dates from the log files
"""
@app.route('/logDates', methods=['GET'])
def getLogDates():

   # Get a list of every file in the logs directory
   files = [f for f in os.listdir('./logs')]

   # Loop every file and trim off the stem and file extention
   for i in range(len(files)):
      files[i] = files[i][4:-4]

   # Sort by time early to late and return the list
   files.sort(key=lambda date: datetime.strptime(date, "%Y-%m-%d"), reverse=True)
   return files

"""
   User / Admin / Control

   Used to check auth on users

   POST -
   {
      uname: User name
      password: Password
      loginType: user / admin / controll
   }

   Response - True or False
"""
@app.route('/checkAuth', methods=["POST"])
def checkAuth():

   # Get the login data
   loginData = request.json

   # Open the json file
   with open("./saves/users.json") as file:
      # Get the json file's data and the users from it
      fileData = json.load(file)
      users = fileData.keys()

      # If the username from the request data is in the users
      if loginData["uname"] in users:

         # If the password from the json file is equal to the password from the loginData
         if (fileData[loginData["uname"]][loginData["loginType"]] == loginData["password"]):
            return Response("True") # Return true if all pass

      return Response("False") # Return false if all pass

app.run(debug=True)
# app.run(host="0.0.0.0", port=5000)