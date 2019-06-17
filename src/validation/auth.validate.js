const validator = require('validator');
const isValidString = require('./is-valid-string');

module.exports.validateRegisterInput = (data) => {
    let error = {};

    // accountname first character cannot be a number
    const firstCharacter = parseInt(data.accountname.trim().slice(0, 1));    
    if(    firstCharacter === 1 
        || firstCharacter === 2
        || firstCharacter === 3
        || firstCharacter === 4
        || firstCharacter === 5
        || firstCharacter === 6
        || firstCharacter === 7
        || firstCharacter === 8
        || firstCharacter === 9
        || firstCharacter === 0 ) {
        error.firstCharacter = 'First character cannot be a number';
    }    

    // check typeof accountname
    if(!isValidString(data.accountname.trim())) {
        error.invalidAccountnameType = 'Invalid accountname type'
    }

    // check typeof password
    if(!isValidString(data.password.trim())) {
        error.invalidPasswordType = 'Invalid password type'
    }
    
    if(validator.isEmpty(data.accountname.trim())) {
        // check accountname empty
        error.emptyAccount = 'Accountname cannot be empty'; 
    } else if(!validator.isLength(data.accountname.trim(), { min: 4, max: 30 } )) {
        // check accountname length        
        error.invalidAccountLength = 'Accountname must be between 4 and 30 characters'        
    }
    
    if(validator.isEmpty(data.password.trim())) {
        // check password empty
        error.emptyPassword = 'Password cannot be empty'; 
    } else if(!validator.isLength(data.password.trim(), { min: 4, max: 20 } )) {
        // check password length
        error.invalidPasswordLength = 'Password must be between 4 and 20 characters'
    }
    
    return error;
}