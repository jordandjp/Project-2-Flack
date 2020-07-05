document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
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

        boton.addEventListener("click", modalAction)
        modalInput.addEventListener("keyup", modalActionEnter)

        function modalAction()
            {
                var user = modalInput.value;
                localStorage.setItem('User', user)
                socket.emit("add user", {"username": user})
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
        for (channel of data['channels'])
        {
            createChannel(channel)
        }     
    });

    // Display the new channel
    
    socket.on('display new channel', data => 
        {
            createChannel(data["channel"])
            console.log("After socket: " + data["channel"])
        })
    
        // Function to manipulate DOM and create channels

    function createChannel(channel)
    {
        if (!document.getElementById(channel))
        {
            var divChannel = document.createElement("DIV");
            divChannel.className = 'eachChannel';
            divChannel.id = channel;
            divChannel.innerHTML = '#' + channel;
            document.getElementById('channels').appendChild(divChannel);
        }
    }

    var newChannel = document.getElementById("newChannel");
    newChannel.addEventListener('keyup', enterfunction);
    function enterfunction(event)
    {
        if (event.keyCode === 13)
        {
            event.preventDefault();
            c = document.getElementById("channels").children
            let comprobacion = true

            // Check if channel name already exists

            for (i = 0; i < c.length; i++)
            {
                if (c[i].id === newChannel.value) 
                {
                alert(`Channel "${newChannel.value}" already exists, please use another name`)
                comprobacion = false
                break;
                }
            }
            
            if (comprobacion && newChannel.value.length > 0 )
            {
                console.log(newChannel.value)
                socket.emit('new channel', {'channel': newChannel.value});
                newChannel.value = "";                
            }   
        }
    }


});

    

// Update text on popping state.
            // window.onpopstate = e => {
            //     const data = e.state;
            //     document.title = data.title;
            //     document.querySelector('#body').innerHTML = data.text;
            // };

            // // Renders contents of new page in main view.
            // function load_page(name) {
            //     const request = new XMLHttpRequest();
            //     request.open('GET', `/${name}`);
            //     request.onload = () => {
            //         const response = request.responseText;
            //         document.querySelector('#welcome').innerHTML = response;

            //         // Push state to URL.
            //         document.title = name;
            //         history.pushState({'title': name, 'text': response}, name, name);
            //     };
            //     request.send();
            // }