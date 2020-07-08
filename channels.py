""" 
    Class Channel record, and control channels and messages 
"""

import json

class Channel():
    allchannels = []
    allobjects = {}
    def __init__(self, channel, messages=[]):
        self.channel = channel
        self.__messages = messages
        self.allchannels.append(self.channel)
        self.allobjects[channel] = self.__messages

    def __str__(self):
        return self

    # def __repr__(self):
    #     return str(self)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
        sort_keys=True, indent=4, ensure_ascii=False)
        
    def set_messages(self, message):
        self.__messages.append(message)
    
    def get_messages(self):
        return self.__messages
        
    # def fix_encode_channel(self):
    #     self.channel = self.channel.encode('latin1').decode('utf8')
    # def fix_encode_message()
        
# Test clase
if __name__ == "__main__":
    general = Channel("genéral", ["Buenas", "Test", "Test3"])
    general.set_messages("Que tal")
    print(Channel.allobjects)
    print(general.get_messages())
#     generaljson = general.toJSON()
    
    # Channel.allobjects["test"] = Channel("test")
    # Channel.allobjects["test"].set_messages("Testing")
    # Channel.allobjects["test"].set_messages("Testing2")
    general.set_messages("Hola")
    Channel("test", ["test1", "test2"])
    print(Channel.allobjects)
    Channel.allobjects["test"].append("test3")
    print("TEST: ", Channel.allobjects["test"])
    print(general.toJSON())
    generaljson = general.toJSON()
    generaldict = json.loads(generaljson)
    def toDict(self):
        json_value = json.dumps(self, default=lambda o: o.__dict__, 
        sort_keys=True, indent=4, ensure_ascii=False)
        todict = json.loads(json_value)
        return todict
    print("DICT!: ", toDict(Channel.allobjects))
    newdict = {"Channel:"}
    print(generaljson)
    # for i in Channel.allobjects:
    #     print(Channel.allobjects[i].get_messages())


#     for x in range(1,10):
#         Channel.allobjects[f"test{x}"] = Channel(str(x))
#         print(Channel.allobjects[f"test{x}"].toJSON())