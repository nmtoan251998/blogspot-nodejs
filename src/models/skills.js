const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = mongoose.Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile',        
    },    
    skill: [

    ]
});

module.exports = mongoose.model('skill', skillSchema);