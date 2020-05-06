const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const uuid = require('uuid')
// const ReviewSchema = require('./Review.js')

const UserSchema = new Schema({
    account: String,
    role: {
        type: String,
        default: 'teacher',
        enum: ['teacher', 'staff', 'owner', 'admin']
    },
    authType: {
        type: String,
        required: true,
        enum: ['google', 'facebook', 'local']
    },
    email: {
        type: String,
        match: [
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please enter a valid email address.'
        ]
      },
    password: {
        type: String,
        required: false,
        minLength: 6,
        select: false
        // match: []
    }, 
    verificationLink: String,
    verifyDate: Date,
    verified: {
        type: Boolean,
        default: true
    }      
})

// Encrypt password with bcryptjs
UserSchema.pre('save', async function(next) {
    if(this.authType !== 'local' || !this.isModified('password')) {
      next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.verificationString();
    next()
})

UserSchema.methods.matchPassword = async function (plainText) {
    return await bcrypt.compare(plainText, this.password)
}

UserSchema.methods.verificationString = async function () {
    this.verificationLink = uuid.v4();
    this.verifyDate = Date.now()   
}

const User = mongoose.model('user', UserSchema);

module.exports = User