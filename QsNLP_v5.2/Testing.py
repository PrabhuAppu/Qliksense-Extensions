import json
from websocket import create_connection
from json import JSONEncoder

class MyEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__    

ws = create_connection("ws://localhost:4848/")
print ("Sending 'Hello, World'...")

handshake = {
	"method": "OpenDoc",
	"handle": -1,
	"params": [
		"D:\\Qlik\\Apps\\Executive Dashboard.qvf"
	],
	"jsonrpc": "2.0",
	"id": 2
}
data = MyEncoder().encode(handshake)
#print (str(handshake))            
ws.send(data)
print ("Sent")
print ("Receiving...")
result =  ws.recv()
print ("Received '%s'" % result)
ws.close()
'''
import websocket
#import thread
#import time

#ws = create_connection("ws://localhost:4848/app/%3Ftransient%3D")

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print (error)

def on_close(ws):
    print ("### closed ###")

def on_open(ws):
     print ("### opened ###")


#if __name__ == "__main__":
websocket.enableTrace(True)
ws = websocket.WebSocketApp("ws://localhost:4848/app/%3Ftransient%3D",on_message = on_message,on_error = on_error,on_close = on_close)
ws.on_open = on_open

ws.run_forever()
'''