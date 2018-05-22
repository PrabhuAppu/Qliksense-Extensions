import json
from websocket import create_connection
from json import JSONEncoder

class MyEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

def openApplication(ws, applicationID, requestID):
    #print ("### opened ###")
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

def GetInfo(appId, request):
    ws = create_connection("ws://localhost:4848/app")
    #application = "C:\\Users\\359084\\Documents\\Qlik\\Sense\\Apps\\Executive Dashboard.qvf"
    application = appId#"D:\Qlik\Apps\Executive Dashboard.qvf"
    #application = "D:\Qlik\Apps\Consumer_Sales.qvf"
    requestID = 1
    # Open the qliksense application
    openApplication(ws, application, requestID)
    requestID+=1
    result =  ws.recv()
    result =  ws.recv()
    data = MyEncoder().encode(request)
    ws.send(data)
    return eval(ws.recv().replace("true","True"))