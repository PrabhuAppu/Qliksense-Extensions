import os
import json
from websocket import create_connection
from json import JSONEncoder
import csv

requestID = 1;

class MyEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

def on_message(ws, message):
    print(message)
    ws.close()

def on_error(ws, error):
    print (error)

def on_close(ws):
    print ("### closed ###")

def openApplication(ws, applicationID, requestID):
    print ("### opened ###")
    handshake = {
        "method": "OpenDoc",
        "handle": -1,
        "params": [
            applicationID
        ],
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(handshake)
    ws.send(data)
    print ("Sent")

def getTableandFields(ws, requestID):
    print('### Get Table info ###')
    request = {
        "handle": 1,
        "method": "GetTablesAndKeys",
        "params": {
            "qWindowSize": {
                "qcx": 0,
                "qcy": 0
            },
            "qNullSize": {
                "qcx": 0,
                "qcy": 0
            },
            "qCellHeight": 0,
            "qSyntheticMode": False,
            "qIncludeSysVars": False
        },
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(request)
    ws.send(data)
    print ("Sent")

def getAllInfo(ws, requestID):
    print('### Get App info ###')
    request = {
        "handle": 1,
        "method": "GetAllInfos",
        "params": {},
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(request)
    ws.send(data)
    print ("Sent")

def getDimensionInfo(ws, dimID, requestID):
    #print('### Get Dim info ###')
    request = {
        "handle": 1,
        "method": "GetDimension",
        "params": {
            "qId": dimID
        },
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(request)
    ws.send(data)
    requestID+=1
    result = eval(ws.recv())
    requestDimInfo = {
        "handle": result['result']['qReturn']['qHandle'],
        "method": "GetDimension",
        "params": {
        },
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(requestDimInfo)
    ws.send(data)
    result = eval(ws.recv())
    return result['result']
    
def getMeasureInfo(ws, measID, requestID):
    #print('### Get Measure info ###')
    #print(measID)
    request = {
        "handle": 1,
        "method": "GetMeasure",
        "params": {
            "qId": measID
        },
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(request)
    ws.send(data)
    requestID+=1
    result = eval(ws.recv())
    #print(result)
    requestMeasInfo = {
        "handle": result['result']['qReturn']['qHandle'],
        "method": "GetMeasure",
        "params": {
        },
        "jsonrpc": "2.0",
        "id": 26
    }
    data = MyEncoder().encode(requestMeasInfo)
    ws.send(data)
    result = eval(ws.recv())
    #print(result)
    return result['result']

ws = create_connection("wss://playground.qlik.com/")
#application = "C:\\Users\\359084\\Documents\\Qlik\\Sense\\Apps\\Executive Dashboard.qvf"
application = "D:\Qlik\Apps\Executive Dashboard.qvf"
#application = "D:\Qlik\Apps\Consumer_Sales.qvf"
requestID = 1
# Open the qliksense application
openApplication(ws, application, requestID)
requestID+=1
result =  ws.recv()

# Get table Info
getTableandFields(ws, requestID)
requestID+=1
result =  ws.recv()

# Parse the data and store the field list in a txt file
jsonResult = eval(result.replace("true","True"))
head, tail = os.path.split(application)
metaDir= "data\\"+tail+"\\" 
if not os.path.exists(metaDir):
    os.makedirs(metaDir)

# Write only Field Names
with open(metaDir+"fieldList.csv", "w") as csvfile:
    fieldlistwriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
    for table in jsonResult['result']['qtr']:
        for field in table['qFields']:
            fieldlistwriter.writerow([field['qName']])

# Field Classifications
with open(metaDir+'fieldClassification.csv', 'w', newline='') as csvfile:
    classificationWriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    classificationWriter.writerow(['fieldName', 'isText', 'isKey', 'isDate', 'isTimeStamp', 'isInteger', 'isNumeric', 'uniqueness'])                            
    for table in jsonResult['result']['qtr']:
        for field in table['qFields']:
            isText = False
            if "$text" in field['qTags']:
                isText = True
            isKey = False
            if "$key" in field['qTags']:
                isKey = True
            isDate = False
            if "$date" in field['qTags']:
                isDate = True
            isTimeStamp = False
            if "$timestamp" in field['qTags']:
                isTimeStamp = True
            isInteger = False
            if "$integer" in field['qTags']:
                isInteger = True
            isNumeric = False
            if "$numeric" in field['qTags']:
                isNumeric = True
            classificationWriter.writerow([field['qName'], isText, isKey, isDate, isTimeStamp, isInteger, isNumeric, field['qnTotalDistinctValues']/field['qnRows']])

# Get All info of the application
getAllInfo(ws, requestID)
requestID+=1
result =  ws.recv()

# Get Master dimensions and measures
jsonResult = eval(result)

print('### Get Dimension & Measure info ###')

# Filter dimensions and measures from Global Generic Objects
dimensionList = [obj for obj in jsonResult['result']['qInfos'] if obj['qType'] == 'dimension']
measureList = [obj for obj in jsonResult['result']['qInfos'] if obj['qType'] == 'measure']

# Store dimension names in txt file
with open(metaDir+"masterDimList.csv", "w") as csvfile:
    dimLabelWriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
    for dim in dimensionList:
        dimInfo = getDimensionInfo(ws, dim['qId'], requestID)
        requestID+=1
        dimLabelWriter.writerow([dimInfo['qDim']['title']])

# Store dimension definitions in txt file
with open(metaDir+'masterDimDefList.csv', 'w', newline='') as csvfile:
    dimDefWriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for dim in dimensionList:
        dimInfo = getDimensionInfo(ws, dim['qId'], requestID)
        requestID+=1
        for Ddef in dimInfo['qDim']['qFieldDefs']:
            if len(dimInfo['qDim']['qFieldLabels'])>0:
                dimDefWriter.writerow([dimInfo['qDim']['qFieldLabels'][0], Ddef])
            else:
                dimDefWriter.writerow(["", Ddef])

# Store measure names in txt file
with open(metaDir+"masterMeasureList.csv", "w") as csvfile:
    measureLabelWriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
    for meas in measureList:
        measInfo = getMeasureInfo(ws, meas['qId'], requestID)
        requestID+=1
        measureLabelWriter.writerow([measInfo['qMeasure']['qLabel']])

# Store measure definitions in txt file
with open(metaDir+'masterMeasureDefList.csv', 'w', newline='') as csvfile:
    measureDefWriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for meas in measureList:
        measInfo = getMeasureInfo(ws, meas['qId'], requestID)
        requestID+=1
        measureDefWriter.writerow([measInfo['qMeasure']['qDef']])

ws.close()