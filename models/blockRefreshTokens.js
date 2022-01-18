const mongoose = require('mongoose');

const blockTokenSchema = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true
    }
}, { versionKey: false })

const blockTokenModel = mongoose.model('BlockedRefreshToken', blockTokenSchema);
module.exports = blockTokenModel;