const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eduSchema = mongoose.Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile',        
    },    
    edu: [

    ]
});

module.exports = mongoose.model('edu', eduSchema);