from flask import Flask
from flask.ext.cors import CORS

from json import JSONEncoder

app = Flask(__name__)
CORS(app)

class MyEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

@app.route("/GetData")
def main():

    handshake = {
        "method": "OpenDoc",
        "handle": -1,
        "params": [
            'applicationID'
        ],
        "jsonrpc": "2.0",
        "id": 'requestID'
    }
    data = MyEncoder().encode(handshake)
    print (request.args.get('q'))
    return data

@app.route('/query/<query>')
def show_user_profile(query):
    # show the user profile for that user
    print(query)
    return 'User %s' % query

if __name__ == "__main__":
    app.run()