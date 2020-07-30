import os, json

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from channels import Channel


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

general = Channel("general")
test = Channel("Test100")

general.set_message(user="Owner", msg="Welcome to Flack!")

for i in range(1, 105):
    test.set_message(user="Robotest", msg=f"Message #{i}")

users_sid = {}
    
# To solve character encoding errors
def fix_encoding(string):
    string_fixed = string.encode('latin1').decode('utf-8')
    return string_fixed

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("new channel")
def newChannel(data):
    fixed_channel = fix_encoding(data['channel'])
    if not Channel.exist_channel(fixed_channel):
        Channel(fixed_channel)
        emit("display new channel",  {"channel": fixed_channel}, broadcast=True)
    else:
        pass        

@socketio.on("user connected")
def listChannels(data):
    emit("list channels",  Channel.ready_to_emit(), broadcast=True)
    
@socketio.on("add user")
def addUser(data):
    username = fix_encoding(data['username'])
    users_sid[request.sid] = username
    emit("welcome user", {"username": username})

@socketio.on("new_message")
def newMessage(data):
    fixed_message = fix_encoding(data['message'])
    fixed_channel = fix_encoding(data['channel'])
    fixed_user = fix_encoding(data['user'])
    if Channel.exist_channel(fixed_channel):
        Channel.exist_channel(fixed_channel).set_message(msg=fixed_message, user=fixed_user, datetime_now= data['datetime_now'])
        emit("display new message", {'message': fixed_message, 'channel': fixed_channel, 'user': fixed_user, 'datetime_now': data['datetime_now']}, broadcast=True)
        
    else:
        return "Channel does not exist"
    
@socketio.on("disconnect")
def user_disconnect():
    try:
        users_sid.pop(request.sid)
    except Exception as e:
        print("Does not exist that sid in users_sid")
        return e        
    