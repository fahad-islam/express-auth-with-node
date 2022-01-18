const mongoose = require('mongoose');

const loginUpScheme = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true   
    }, 
    password: {
        required: true,
        type: String,
    },
    refreshToken: {
        type: String,
        required: true,
    }
}, { versionKey: false })

const LogInModel = mongoose.model('User Login Session', loginUpScheme)
module.exports = LogInModel;