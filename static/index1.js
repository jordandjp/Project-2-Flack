document.addEventListener('DOMContentLoaded', () => {

    // Storing information in client-side if it already haven't 
    // And prompting for username

    if (!localStorage.getItem('User')) {
            $("#myModal").modal({backdrop: 'static', keyboard: false});
            $('.modal-title').text("Flack");
            $('.modal-description').text("Please enter your username to start chatting");
        }

    // Getting text input from modal

    var modalInput = document.getElementById("modalInput")
    var boton = document.getElementById("modalButton")

    // Adding events (click, enter) to display input modal

    boton.addEventListener("click", modalAction)
    modalInput.addEventListener("keyup", modalActionEnter)

    function modalAction()
        {
            var user = document.getElementById('modalInput').value
            document.getElementById('welcome').innerHTML = `Hi, ${user}`;
        }
    function modalActionEnter(event)
    {
        if (event.keyCode === 13)
        {
            modalAction()
            $('#myModal').modal('hide');
        }
    }
        
    //  $("#modalButton").on('click', () => {
    //      var user = $('#modalInput').val();
    //      document.getElementById('welcome').innerHTML = `Hi, ${user}`;
    //      console.log("working")
    //  })

    const user = localStorage.getItem('User');
    if (user){
        document.getElementById('welcome').innerHTML = `Hi, ${user}`;
    }

    // Creating channel

    var newChannel = document.getElementById("newChannel");
    newChannel.addEventListener('keyup', enterfunction);

    function enterfunction(event)
    {
        if (event.keyCode === 13)
        {
            event.preventDefault();
            console.log("Funciona");
            var divChannel = document.createElement("DIV");
            divChannel.className = 'eachChannel';
            divChannel.innerHTML = '#' + newChannel.value;
            document.getElementById('channels').appendChild(divChannel);
        }
    }
});



// Update text on popping state.
            window.onpopstate = e => {
                const data = e.state;
                document.title = data.title;
                document.querySelector('#body').innerHTML = data.text;
            };

            // Renders contents of new page in main view.
            function load_page(name) {
                const request = new XMLHttpRequest();
                request.open('GET', `/${name}`);
                request.onload = () => {
                    const response = request.responseText;
                    document.querySelector('#welcome').innerHTML = response;

                    // Push state to URL.
                    document.title = name;
                    history.pushState({'title': name, 'text': response}, name, name);
                };
                request.send();
            }