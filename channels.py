""" 
    Handler channels and messages 
"""

import json

class Channel():
    
    # Variable to record all objects created
    __allObjects = []
    
    def __init__(self, channel):
        self.__channel = channel
        self.__messages = []
        self.__allObjects.append(self)
    
    @classmethod
    def get_allObjects(cls):
        return cls.__allObjects
    
    # Get all channels names
    @classmethod
    def get_allChannels(cls):
        all_channels = []
        for channel_object in Channel.get_allObjects():
            all_channels.append(channel_object.get_channel())
        return all_channels

    # Get all objects and return a dict ready to send to client-server 
    @classmethod
    def ready_to_emit(cls):
        json_value = json.dumps(cls.__allObjects, default=lambda o: o.__dict__, 
        sort_keys=True, indent=4, ensure_ascii=False)
        ready_to_emit = json.loads(json_value)
        return ready_to_emit
    
    @classmethod
    def exist_channel(cls, channel):
        for obj_channel in cls.get_allObjects():
            if obj_channel.get_channel() == channel:
                return obj_channel
        return False
    
    def set_message(self, user, msg):
        self.__messages.append({"user": user, "message": msg})
        self.max_100msg() 
    
    def get_messages(self):
        return self.__messages
    
    def get_channel(self):
        return self.__channel
    
    # To storage only 100 msg at each channel 
    def max_100msg(self):
        if len(self.get_messages()) > 100:
            del self.get_messages()[0: len(self.get_messages()) - 100]
        
# Test clase
if __name__ == "__main__":
    pass