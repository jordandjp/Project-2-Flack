import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from channels import Channel
# To solve character encoding errors
from ftfy import fix_encoding

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

general = Channel("general")
test = Channel("Test100")
users = []

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("new channel")
def newChannel(data):
    newChannel = (data['channel'])
    if not newChannel in Channel.allchannels:
        # fixed_channel = fix_encoding(newChannel)
        fixed_channel = newChannel.encode('latin1').decode('utf8')
        Channel(fixed_channel)
        emit("display new channel",  {"channel": fixed_channel}, broadcast=True)
    else:
        pass        

@socketio.on("user connected")
def listChannels(data):
    emit("list channels",  {"channels": Channel.allchannels}, broadcast=True)
    
@socketio.on("add user")
def addUser(data):
    users.append(data['username'])
    emit("welcome user", {"username": data['username']})

