const crypto =require('crypto');

// Validate the given email is valid or not
function isValidEmail(str){
    let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let res = str.match(pattern);
        if(res)
            return true;
}


// Validate the password format min 6 chars, one Uppercase 
function validatePassword(str){
    let pattern= /^(?=[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*[A-Z])[A-Za-z0-9]{6,30}$/;

    let res = str.match(pattern);
        if(res)
            return true;
}

module.exports ={
    isValidEmail : isValidEmail,
    validatePassword : validatePassword,
}


