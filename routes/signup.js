const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const SignUpModel = require('../models/signup')

router.post('/', async (req, res, next) => {
    console.log(req.body);
    const { username, email, password: plainTextpassword } = (req.body);
    if ( username, email, plainTextpassword ) {
        const password = await bcrypt.hash(plainTextpassword, 10), 
            User = new SignUpModel({username, email, password})
        User.save((err, data) => {
            if (err) {
                if (err.code === 11000) {   
                    console.log(JSON.stringify(err));
                    if (Object.keys(err.keyValue)[0] === "username") {
                        res.status(404).json({ status: 'error', message: `someone owns this ${Object.keys(err.keyValue)[0]}` })
                    } else {
                        res.status(404).json({ status: 'error', message: `user already founded with same ${Object.keys(err.keyValue)[0]}` })
                    }
                }
            }
            if (!err) {
                console.log(bcrypt.compare(data.password));
                res.status(201).json({ status: 'ok', message: 'user is registered!', data })

            }
        })
    }
})

module.exports = router;