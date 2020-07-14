document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var first_connect = true
    var selected_channel;
    // Storing information in client-side if it already haven't 
    // And prompting for username
    socket.on('connect', () => { 

        if (!localStorage.getItem('User')) {
            $("#myModal").modal({backdrop: 'static', keyboard: false});
            $('.modal-title').text("Flack");
            $('.modal-description').text("Please enter your username to start chatting");
        }

        else
        {
            const user = localStorage.getItem('User');
            socket.emit("add user", {"username": user})
        }
        // Getting text input from modal

        var modalInput = document.getElementById("modalInput")
        var boton = document.getElementById("modalButton")
        boton.disabled = true

        // Adding events (click, enter) to display input modal

        boton.addEventListener("click", modalAction);
        modalInput.addEventListener("keyup", modalActionEnter);

        function modalAction()
            {
                var user = modalInput.value;
                localStorage.setItem('User', user);
                socket.emit("add user", {"username": user});
            }

        function modalActionEnter(event)
        {
            if (document.getElementById('modalInput').value.length > 0)
            {
                boton.disabled = false
                if (event.keyCode === 13)
                {
                    modalAction()
                    $('#myModal').modal('hide');
                }
            }
            else
            {
                boton.disabled = true
            }
        } 
    });

    // Getting and setting localstorage
    socket.on('welcome user', data =>
        {
            document.getElementById('welcome').innerHTML = `Hi, ${data['username']}!`;
            // Figure out if the channel was saved from last time
            if (!localStorage.getItem('selected_channel')) {
                // No selected channel yet, set it to "general"
                selected_channel = "general";
                localStorage.setItem('selected_channel', selected_channel);
                // // Is the selected channel a private message channel?
                // localStorage.setItem('pm', 'no');
            } else {
                selected_channel = localStorage.getItem('selected_channel');
            }
    
            socket.emit('user connected', {'username': data['username']});
        })

    // List channels when user connected

    socket.on('list channels', data => {
        if (first_connect)
        {
            data.forEach((channel_object) => 
            {
                createChannel(channel_object["_Channel__channel"]);
                channel_object["_Channel__messages"].forEach((msg) => 
                {
                    createMessages(channel_object["_Channel__channel"], msg["message"], msg["user"], msg["datetime_now"]);
                })
            })
            first_connect = false;
        }
        var channel_to_display = document.getElementById('msg-' + selected_channel);
        channel_to_display.classList.remove('hide');
    });

    // Display the new channel
    
    socket.on('display new channel', data => 
        {
            createChannel(data["channel"])
        })
    
    // Function to manipulate DOM and create channels

    function createChannel(channel)
    {
        if (!document.getElementById(channel))
        {
            // Create div messages to contain all messages of channel
            var divMessages = document.createElement("DIV");
            divMessages.className = 'hide';
            divMessages.id = 'msg-' + channel;
            document.getElementById('id-messages').appendChild(divMessages);

            // Create div channel
            var divChannel = document.createElement("DIV");
            divChannel.className = 'eachChannelDIV';
            divChannel.id = "DIV"+channel;
            divChannel.innerHTML = `<a class="eachChannel" id="${channel}" href="#";">#${channel}</a>`;
            document.getElementById('channels').appendChild(divChannel);

            // Create onclick function to display channels
            divChannel.firstChild.onclick = function () 
            {
                const div_channel_msg = document.getElementById('msg-'+channel);

                actual_channel_name = document.getElementById('msg-'+selected_channel);
                actual_channel_name.classList.add('hide')
                
        
                // Remove hide to show the messages
                div_channel_msg.classList.remove("hide");
                selected_channel = channel

                // Storage to remember channel
                localStorage.setItem('selected_channel', selected_channel)
            }
        }
    }

    function createMessages(channel, msg, user="", datetime_now)
    {
        let divMessages = document.createElement("DIV");
        divMessages.className = 'msg';
        divMessages.innerHTML = `<h3>${datetime_now} | ${user}: ${msg}</h3>`
        document.getElementById('msg-' + channel).appendChild(divMessages);
    }

    var newChannel = document.getElementById("newChannel");
    newChannel.addEventListener('keyup', channel_function);

    function channel_function(event)
    {
        if (event.keyCode === 13)
        {
            c = document.getElementById("channels").children
            let comprobacion = true

            // Check if channel name already exists
            for (i = 0; i < c.length; i++)
            {
                if (c[i].id === 'DIV'+newChannel.value) 
                {
                alert(`Channel "${newChannel.value}" already exists, please use another name`);
                comprobacion = false;
                break;
                }
            }
            
            if (comprobacion && newChannel.value.length > 0 )
            {
                socket.emit('new channel', {'channel': newChannel.value});
                newChannel.value = "";                
            }   
        }
    }

    var new_message = document.getElementById("chat-box");
    var button_message = document.getElementById('chat-button');
    
    new_message.addEventListener('keyup', message_enter_function);
    button_message.addEventListener('click', message_function);
    

    function message_function()
    {
        // feature shushu
        if (new_message.value === "shushu")
        {
            typewriter(selected_channel)
            new_message.value = ""
            return false;
        }
        // end feature shushu

        if (new_message.value.length > 0)
        {
            let user = localStorage.getItem('User');
            let datetime_now = getTimeStamp()
            socket.emit('new_message', {'message': new_message.value, 'channel': selected_channel, 'user': user, 'datetime_now': datetime_now});
            new_message.value = ""
        }  
    }

    function message_enter_function(event)
    {
        if (event.keyCode === 13)
        {
            message_function()
        }
    }

    socket.on('display new message', data => {
        createMessages(data['channel'], data['message'], data['user'], data['datetime_now']);
        channel_div = document.getElementById("msg-"+data['channel']);
        if (channel_div.childNodes.length > 100)
        {
            channel_div.removeChild(channel_div.firstElementChild); 
        }
    })

    function getTimeStamp() {
        let now = new Date();
        let dateyDate = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
        let hr = now.getHours();
        let min = ('0' + now.getMinutes()).slice(-2);   // https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
        let ampm = 'AM';
        if (hr >= 12) {
            if (hr != 12)
            {
                hr = hr - 12;
            }
            ampm = 'PM';
        }
        return (dateyDate + ' ' + hr + ':' + min + ampm);
    }
});