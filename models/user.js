//in this model we need mongoose:
const mongoose = require('mongoose');
//and built in mongoose schema:
const Schema = mongoose.Schema;
//and our passport package:
const passportLocalMongoose = require('passport-local-mongoose');

//and our basic user schema:
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        //email must be unique:
        unique: true
    }
});

//and here we use plugin method so it will automatically adds username, hashed password: 
UserSchema.plugin(passportLocalMongoose);

//and export:
module.exports = mongoose.model('User', UserSchema);