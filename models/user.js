const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLM = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    }
})

userSchema.plugin(passportLM);

const User = mongoose.model('User', userSchema);
module.exports = User;