document.addEventListener('DOMContentLoaded', () => {

    // Start by loading first page.
    // if (localStorage.getItem('User')){
    //     load_page('welcome');
    // }
    
    let button = document.getElementById('user-button');
    button.addEventListener('click', buttonClick);
   

    function buttonClick()
    {
        let user = document.getElementById('user').value;
        localStorage.setItem("User", user);
        document.getElementById('welcome').innerHTML = `Hi, ${user}`
    }
    let user = localStorage.getItem('User');
    document.getElementById('welcome').innerHTML = `Hi, ${user}`

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