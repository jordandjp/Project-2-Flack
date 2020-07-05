""" 
    Class Channel record, and control channels and messages 
"""

import json

class Channel():
    allchannels = []
    def __init__(self, channel, messages=[]):
        self.channel = channel
        self.messages = messages
        self.allchannels.append(self.channel)

    def __str__(self):
        return self.channel

    def __repr__(self):
        return str(self)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
        sort_keys=True, indent=4)