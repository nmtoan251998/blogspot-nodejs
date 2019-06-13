const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expSchema = mongoose.Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile',        
    },    
    exp: [

    ]
});

module.exports = mongoose.model('exp', expSchema);