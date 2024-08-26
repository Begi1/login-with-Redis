import * as validation from './validation.js'

const api = "http://localhost:3000"
let emailForChangePassword = "giorgibegii@gmail.com"

async function registration() {
    const email = document.getElementById('registration__email').value;
    const username = document.getElementById('registration__username').value;
    const password = document.getElementById('registration__password').value;
    const passwordRepeated = document.getElementById('registration__passwordRepeated').value;
    const validationElement = document.getElementById('registration__validation');

    // Check if any field is empty
    if (!email || !username || !password || !passwordRepeated) {
        showCard("Please fill out all fields.", validationElement)
        return
    }else{
        cardHide(validationElement)
    }

    // check email format
    if (!validation.validateEmail(email)) {
        showCard("Please enter a valid email address.", validationElement)
        return
    }else{
        cardHide(validationElement)
    }

    //check email and username in db
    const answer = await validation.checkRegistrationInfo(username, email)

    if (answer.email) {
        showCard("Email already exists.", validationElement)
        return
    }else if(answer.username){
        showCard("User already exists.", validationElement)
        return
    }else{
        cardHide(validationElement)
    }

    //Check if the password matches
    validation.passwordMatching(password, passwordRepeated, validationElement)

    const user = {
        key: username,
        data: {
            email: email,
            username: username,
            password: password
        }
    }

    fetch(api + "/registration", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
        console.log('Success:', data);
        })
        .catch(error => {
        console.error('Error:', error);
    });
}
window.registration = registration

async function logIn() {
    const username = document.getElementById('login__username').value;
    const password = document.getElementById('login__password').value;
    const validationElement = document.getElementById('login__validation');

    if (!username || !password) {
        showCard("Please fill out all fields.", validationElement)
        return
    }else{
        cardHide(validationElement)
    }

    const answer = await validation.checkUser(username, password)

    if (!answer.username) {
        showCard("Username not found.", validationElement)
        return
    }else if(!answer.password){
        showCard("Password not correct.", validationElement)
        return
    }else{
        cardHide(validationElement)
        localStorage.setItem('jwt', answer.jwtToken);
    }

    if(answer.jwtToken != null){
        document.getElementById('main__header').textContent = `Hello ${username}`
        cardChanger('login', "main")
    }
}
window.logIn = logIn

async function forgotPasswordEmailCheck() {
    const email = document.getElementById('forgotPassword0__email').value;
    const validationElement = document.getElementById('forgotPassword0__validation');
    const emailValidation = await validation.checkEmail(email)

    emailForChangePassword = email
    if(!emailValidation){
        showCard("Email not found.", validationElement)
    }else{
        cardChanger('forgotPassword0', 'forgotPassword1')
    }
}
window.forgotPasswordEmailCheck = forgotPasswordEmailCheck

async function changePassword() {
    const password = document.getElementById('forgotPassword1__password').value;
    const passwordRepeated = document.getElementById('forgotPassword1__passwordRepeated').value;

    const validationElement = document.getElementById('forgotPassword1__validation');

    if(!password || !passwordRepeated){
        showCard("Please fill out all fields.", validationElement)
        
        return
    }else{
        cardHide(validationElement)
    }
    validation.passwordMatching(password, passwordRepeated, validationElement)
    
    let data = {
        email: emailForChangePassword,
        password: password
    }

    try {
        const response = await fetch(api + "/changePassword", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Success:', responseData);
    } catch (error) {
        console.error('Error:', error);
    }
}
window.changePassword = changePassword

function cardHide(validationElement) {
    validationElement.innerHTML = "";
    validationElement.style.display = 'none';
}

function showCard(text, validationElement) {
    validationElement.innerHTML = text;
    validationElement.style.display = 'block';
}

function cardChanger(card, nextCard) {
    document.getElementById(card).style.display = 'none'
    document.getElementById(nextCard).style.display = 'flex'
}
window.cardChanger = cardChanger

function deleteJWT() {
    localStorage.removeItem('jwt');
}
window.deleteJWT = deleteJWT