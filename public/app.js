const form = document.querySelector('#form1');
const username = document.querySelector('#Username');
const email = document.querySelector('#Email');
const password = document.querySelector('#Password');

form.addEventListener('submit', e => {
    e.preventDefault();
    const registerDetails =  {
        name: username.value,
        email: email.value,
        password: password.value
    };

    fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(registerDetails)
    })
    .then(res => res.json())
    .then(response => {
        if(response.error) {
            alert('Please input right credentials!');
        } else {
            localStorage.setItem('token', response.token);
            alert(`Välkommen ${registerDetails.name}! Du kan nu logga in!`);
        }
    })
});


const loginform = document.querySelector('#form2');
const useremail = document.querySelector('#userEmail');
const userpassword = document.querySelector('#userPassword');

loginform.addEventListener('submit', e => {
    e.preventDefault();
    const loginDetails = {
        email: useremail.value,
        password: userpassword.value
    };

    fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(loginDetails)
    })
    .then(res => res.json())
    .then(response => {
        if(response.error) {
            alert('Please input right credentials!');
        } else {
            localStorage.getItem('token', response.token);
            location.href = response.redirect;
        }
    })
});