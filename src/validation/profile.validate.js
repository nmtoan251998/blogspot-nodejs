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

module.exports.validateEduProfileInput = (data) => {
    let error = {};            
    // ======= Check null or empty ======= \\
    if(validator.isEmpty(data.major.trim())) {        
        error.emptyMajor = 'Major cannot be empty'; 
    }

    if(validator.isEmpty(data.school.trim())) {        
        error.emptySchool = 'School cannot be empty'; 
    }
    
    return error;
}

module.exports.validateExpProfileInput = (data) => {
    let error = {};            

    console.log(data)
    // ======= Check null or empty ======= \\
    if(validator.isEmpty(data.title.trim())) {        
        error.emptyTitle = 'Title cannot be empty'; 
    }

    if(validator.isEmpty(data.company.trim())) {        
        error.emptyCompany = 'Company cannot be empty'; 
    }
    
    return error;
}