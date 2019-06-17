const validator = require('validator');

module.exports.validateBasicProfileInput = (data) => {
    let error = {};        

    // ======= Check null or empty ======= \\
    if(validator.isEmpty(data.firstname.trim())) {        
        error.emptyFirstname = 'Firstname cannot be empty'; 
    }

    if(validator.isEmpty(data.lastname.trim())) {        
        error.emptyLastname = 'Lastname cannot be empty'; 
    }

    // check email
    if(!validator.isEmail(data.email)) {
        error.invalidEmail = 'Invalid email'; 
    }    

    if(parseInt(data.age) <= 0) {
        error.invalidAge = 'Invalid age'; 
    }

    // ===== Social URI ===== \\
    if(!validator.isURL(data.facebook)) {
        error.invalidFbURI = 'Invalid facebook URI';
    }    
    
    if(!validator.isURL(data.github)) {
        error.invalidGitURI = 'Invalid github URI';
    }
    
    if(!validator.isURL(data.linkedin)) {
        error.invalidLinkedinURI = 'Invalid linkedin URI';
    }
    
    return error;
}