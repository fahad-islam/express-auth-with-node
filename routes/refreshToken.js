const express = require('express');
const jwt =  require('jsonwebtoken')
const LogInModel = require('../models/login');
const blockTokenModel = require('../models/blockRefreshTokens');
const router = express.Router();

const ACESS_TOKEN_SECRET = 'KLH#JHl5kNKKTBJ#L#%t(#)8)#(5y-@U$-u09-%RtfnglDGKVJ903';
const REFRESH_TOKEN_SECRET = 'KLH#JHl5kNKKTBJ#L#%t(#)83kljlth3jlTHLJ#HT3%4%%*$&*(#$';


router.post('/', async (req, res, next) => {

    const { refreshToken: tokenbyUser } = req.body;
    let token = { refreshToken : tokenbyUser }
    if (token) {
        
        const blockedTokens = await blockTokenModel.findOne({ refreshToken: token.refreshToken })
        const { username } = jwt.decode(token.refreshToken, REFRESH_TOKEN_SECRET)
        const User = await LogInModel.findOne({ username })
        console.log(username);
        console.log(User);

        if ( !blockedTokens && token.refreshToken === User.refreshToken ) {
            
            if ( jwt.verify(User.refreshToken, REFRESH_TOKEN_SECRET) ) {
                
                const blockTheToken = await blockTokenModel.insertMany([{ refreshToken: User.refreshToken }])

                const acessToken = jwt.sign({ id: User._id, username: User.username }, ACESS_TOKEN_SECRET, { expiresIn: '1h' })
                const refreshToken = jwt.sign({ id: User._id, username: User.username }, REFRESH_TOKEN_SECRET, { expiresIn: '6M' })
                console.log(refreshToken);
                const UserLogIn = await LogInModel.findOneAndUpdate({ _id: User._id, username : User.username }, { refreshToken: refreshToken }) 
                    .then(res => res)
                    .catch(err => console.log(err.message))

                token = {
                    acessToken,
                    refreshToken: UserLogIn.refreshToken
                }

                res.status(200).json({ status: 'ok', token })
                
            }

        } else {
            res.status(404).json({ status: 'error', message: "Invalid Token!" })
        }
    } else {
        res.status(404).json({ status: 'error', message: "Invalid Token!" })
    }
})

module.exports = router;