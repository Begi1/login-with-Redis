const api = "http://localhost:3000"

export function passwordMatching(password, passwordRepeated, validationElement) {
    if (password !== passwordRepeated) {
        validationElement.innerHTML = "Passwords do not match.";
        validationElement.style.display = 'block';
        return; 
    }else {
        validationElement.innerHTML = ""
        validationElement.style.display = 'none'
    }
}

export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export async function checkRegistrationInfo(username, email) {
    
    let userCheck
    try {
        const response = await fetch(api + `/checkRegistrationInfo?key=${username}&email=${email}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        userCheck = data;

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }

    return userCheck
}

export async function checkUser(username, password) {
    
    let userCheck
    try {
        const response = await fetch(api + `/checkUser?key=${username}&password=${password}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        userCheck = data;

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }

    return userCheck
}

export async function checkEmail(email) {
    
    let userCheck
    try {
        const response = await fetch(api + `/checkEmail/${email}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        userCheck = data;

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }

    return userCheck
}