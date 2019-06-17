const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',        
    },
    handle: {
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
    phone: {
        type: String
    },
    social: {
        facebook: {
            type: String
        },
        github: {
            type: String
        },
        linkedin: {
            type: String
        },
    },
    avatar: {
        type: String,
        default: '/img/coders-tokyo-logo.svg',
    },
    edu: [{
        major: {
            type: String,
            require: true
        },
        school: {
            type: String,
            require: true
        },
        rewards: {
            type: String
        },
        from: {
            type: String
        },
        to: {
            type: String            
        }
    }],
    exp: [{
        title: {
            type: String,
            require: true
        },        
        company: {
            type: String,
            require: true
        },     
        location: {
            type: String
        },
        from: {
            type: String
        },
        to: {
            type: String            
        }
    }]
});

module.exports = mongoose.model('profile', profileSchema);