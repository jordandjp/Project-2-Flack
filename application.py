import os, json

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from channels import Channel


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

general = Channel("general", ["Buenas", "Test", "Test3"])
test = Channel("Test100", ["random", "random2", "random3"])
users = []

def toDict(self):
        json_value = json.dumps(self, default=lambda o: o.__dict__, 
        sort_keys=True, indent=4, ensure_ascii=False)
        todict = json.loads(json_value)
        return todict

# To solve character encoding errors
def fix_encoding(string):
    string_fixed = string.encode('latin1').decode('utf-8')
    return string_fixed

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("new channel")
def newChannel(data):
    newChannel = (data['channel'])
    if not newChannel in Channel.allchannels:
        fixed_channel = fix_encoding(newChannel)
        Channel(fixed_channel)
        emit("display new channel",  {"channel": fixed_channel}, broadcast=True)
    else:
        pass        

@socketio.on("user connected")
def listChannels(data):
    # lista = toDict(Channel.allobjects)
    emit("list channels",  Channel.allobjects, broadcast=True)
    
@socketio.on("add user")
def addUser(data):
    username = fix_encoding(data['username'])
    users.append(username)
    emit("welcome user", {"username": username})

@socketio.on("new_message")
def newMessage(data):
    fixed_message = fix_encoding(data['message'])
    