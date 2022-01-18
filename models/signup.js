const mongoose = require('mongoose');

const signUpScheme = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, email: {
        type: String,
        required: true,
        unique: true   
    }, password: {
        required: true,
        type: String,
    }
}, { versionKey: false })

const SignUpModel = mongoose.model('User', signUpScheme)
module.exports = SignUpModel;