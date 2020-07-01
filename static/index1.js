document.addEventListener('DOMContentLoaded', () => {

    // Start by loading first page.
    // if (localStorage.getItem('User')){
    //     load_page('welcome');
    // }

    if (!localStorage.getItem('User')) {
            $("#myModal").modal({backdrop: 'static', keyboard: false});
            $('.modal-title').text("Please enter your username");
        }

    var boton = document.getElementById("modalButton")
    boton.addEventListener("click",
    () =>{
            var user = document.getElementById('modalInput').value
            document.getElementById('welcome').innerHTML = `Hi, ${user}`;
        })
        
    //  $("#modalButton").on('click', () => {
    //      var user = $('#modalInput').val();
    //      document.getElementById('welcome').innerHTML = `Hi, ${user}`;
    //      console.log("working")
    //  })

    const user = localStorage.getItem('User');
    if (user){
        document.getElementById('welcome').innerHTML = `Hi, ${user}`;
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