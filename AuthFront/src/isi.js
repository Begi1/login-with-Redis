import {passwordMatching, validateEmail, passwordRepeatValidation} from "./validation.js"

function registration() {
    validateEmail()
}

const api = "http://localhost:3000"

window.onload = () => {
    // const registration = document.getElementById('registration')
    // const forgotPassword0 = document.getElementById('forgotPassword0')
    // const forgotPassword1 = document.getElementById('forgotPassword1')
    document.getElementById('registration').style.display = 'none'
    document.getElementById('forgotPassword0').style.display = 'none'
    document.getElementById('forgotPassword1').style.display = 'none'
}



async function registration () {

    const email = document.getElementById('registration__email').value;
    const username = document.getElementById('registration__username').value;
    const password = document.getElementById('registration__password').value;
    const passwordRepeated = document.getElementById('registration__passwordRepeated').value;

    const validationElement = document.getElementById('registration__validation');

    // Check if any field is empty
    if (!email || !username || !password || !passwordRepeated) {
        validationElement.innerHTML = "Please fill out all fields.";
        validationElement.style.display = 'block';
        return;
    }


    // Validate user
    let userCheck
    try {
        const response = await fetch(api + "/usernameChecker/" + username);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        userCheck = data.exists;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }

    if (userCheck) {
        validationElement.innerHTML = "User already exists";
        validationElement.style.display = 'block';
        return; 
    }else{
        validationElement.innerHTML = "";
        validationElement.style.display = 'none';
    }

    // Validate email format

    let emailCheck

    try {
        const response = await fetch(api + "/emailChecker/" + username);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const email = await response.json();
        emailCheck = email
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }

    if (!validateEmail(email) || email === emailCheck) {
        validationElement.innerHTML = "Please enter a valid email address.";
        validationElement.style.display = 'block';
        return; 
    }

    // Validate password matching




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






// async function userIdGen() {
//     let id

//     try {
//         const response = await fetch(api + "/ids");
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         id = data.message;
//     } catch (error) {
//         console.error('There has been a problem with your fetch operation:', error);
//     }

//     const newId = {
//         key: "id",
//         id: id
//     }

//     fetch(api + "/newId", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newId)
//       })



//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })



//       .then(data => {
//         console.log('Success:', data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//     });

//     return id
// }







