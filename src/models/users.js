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
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);