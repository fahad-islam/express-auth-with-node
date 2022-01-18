const express = require('express');
const jwt =  require('jsonwebtoken')
const SignUpModel = require('../models/signup');
const LogInModel = require('../models/login');
const bcrypt = require('bcryptjs')
const router = express.Router();

const ACESS_TOKEN_SECRET = 'KLH#JHl5kNKKTBJ#L#%t(#)8)#(5y-@U$-u09-%RtfnglDGKVJ903';
const REFRESH_TOKEN_SECRET = 'KLH#JHl5kNKKTBJ#L#%t(#)83kljlth3jlTHLJ#HT3%4%%*$&*(#$';


router.post('/', async (req, res, next) => {

    const { username, password: plainTextpassword, token } = req.body;

    if ( username && plainTextpassword && !token) {

        const User = await SignUpModel.findOne({username})
        if ( await bcrypt.compare(plainTextpassword, User.password)) {
            
            const acessToken = jwt.sign({ id: User._id, username: User.username }, ACESS_TOKEN_SECRET, { expiresIn: '1h' })
            const refreshToken = jwt.sign({ id: User._id, username: User.username }, REFRESH_TOKEN_SECRET, { expiresIn: '6M' })

            let UserLogIn = await LogInModel.insertMany([ { id: User._id, username: User.username, email: User.email, password: User.password, refreshToken } ])
                .then(res => res)
                .catch(err => {
                    if (err.code === 11000) {
                        return LogInModel.updateOne({ username: User.username }, { '$set' : { id: User._id, username: User.username, email: User.email, password: User.password, refreshToken } })
                    }
                })
            // UserLogIn.save()

            const token = {
                acessToken,
                refreshToken,
            }

            res.status(200).json({ status: 'ok', message: "Logged In Sucessfully", token })
            console.log(plainTextpassword, "is real password")
        } else {
            res.status(404).json({ status: 'error', message: "username or password is invalid!" })
        }
    } else {
        res.status(404).json({status: 'error', message: 'username or password is invalid!'})
    }
})

module.exports = router;