import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = ["general", "test", "test2"]
users = []

@app.route("/")
def index():
    return render_template('index.html', channels=channels)

@socketio.on("new channel")
def newChannel(data):
    newChannel = (data['channel'])
    if not newChannel in channels:
        channels.append(newChannel)
        emit("display new channel",  {"channel": newChannel}, broadcast=True)
    else:
        pass        

@socketio.on("user connected")
def listChannels(data):
    emit("list channels",  {"channels": channels}, broadcast=True)
    
@socketio.on("add user")
def addUser(data):
    users.append(data['username'])
    emit("welcome user", {"username": data['username']})

