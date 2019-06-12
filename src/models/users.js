const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    accountname: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    age: {
        type: Number
    },
    address: {
        type: String
    }, 
    edu: [

    ],
    exp: [

    ],
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);