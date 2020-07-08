document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var first_connect = true
    
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
            document.getElementById('welcome').innerHTML = `Hi, ${data['username']}`;
            // Figure out if the channel was saved from last time
            if (!localStorage.getItem('selected_channel')) {
                // No selected channel yet, set it to "general"
                selected_channel = "general";
                localStorage.setItem('selected_channel', selected_channel);
                // Is the selected channel a private message channel?
                localStorage.setItem('pm', 'no');
            } else {
                selected_channel = localStorage.getItem('selected_channel');
            }
    
            socket.emit('user connected', {'username': data['username'], 'selected_channel': selected_channel, 'pm': localStorage.getItem('pm')});
        })

    // List channels when user connected

    socket.on('list channels', data => {
        if (first_connect)
        {
            for (const channel in data)
            {
                createChannel(channel)
                for (const msg of data[channel]) {
                    // Create msg
                    createMessages(channel, msg)
                }
            }
            first_connect = false
            
        }
        console.log(first_connect)
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
            divChannel.innerHTML = `<a class="eachChannel" id="${channel}" href="#msg-${channel}" onclick="display(${channel});">#${channel}</a>`;
            document.getElementById('channels').appendChild(divChannel);
            
        }
    }

    function createMessages(channel, msg)
    {
        let divMessages = document.createElement("DIV");
        divMessages.className = 'msg';
        divMessages.innerHTML = `<h1>${msg}</h1>`
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
    
    button_message.addEventListener('click', message_function);

    function message_function()
    {
        socket.emit('new_message', {'message': new_message.value});
    }

});