const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let Schema = mongoose.Schema;
let userSchema = new Schema({
    name: {type: String, required:[true, 'The name is required']},
    email: {type: String, required:[true, 'The email is required'], unique: true},
    password: {type: String, required:[true, 'You must put a password']},
    img: {type: String, required:false},
    role: {type: String, default: 'USER_ROLE', enum: validRoles},
    status: {type: Boolean, default: true},
    google: {type: Boolean, default: false}
});

userSchema.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('User', userSchema);