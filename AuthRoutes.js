
const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/User')
const uuid = require('uuid')

//make sure you have created api credentials for each oauth provider

// ********************** ROUTES FOR ALL STRATEGIES
router.get('/api/auth/user', (req, res) => {
    res.send(req.user)
})

router.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})
// ****************************** GOOGLE ROUTES
router.get('/api/auth/google/', passport.authenticate('google', {scope:['email', 'profile']}));

router.get(
    '/api/auth/google/callback', 
    passport.authenticate('google'),
    (req, res) => res.redirect('/')
);

//***************************  FACEBOOK ROUTES
router.get('/api/auth/facebook/', passport.authenticate('facebook', {scope:['public_profile']}));

router.get(
    '/api/auth/facebook/callback', 
    passport.authenticate('facebook'),
    (req, res) => res.redirect('/')
);

// *************************   LOCAL ROUTES
router.post('/api/auth/register', async (req, res, next) => {
    const { email, password, name } = req.body;
    
    try {
        //check for all required info and if email in use
        if(!name || !email || !password) throw new Error('Please include all required fields')
        const emailInUse = await User.findOne({ email });
        if(emailInUse) {
            return next(new Error('Email already in use'))
        } else {
            //create new account. verified: false until link clicked in email
            const account = uuid.v4();
            const newUser = await User.create({
                name,
                account,
                email,
                password,
                authType: 'local',
                verified: false
            })
            // create email link with token from new user
            const message = {
                to: [newUser.email],
                from: 'no-reply@website.com',
                subject: 'Follow the link to verify your account at WEBSITE',
                text: `Follow the link to verify your account at http://localhost:3000/verify/${newUser.verificationLink}`,
                html: verificationTemplate(newUser.verificationLink)
              };
            //send email return new users
            mailer(message);
            res.status(200).send(newUser);
        }
    }
    catch(err) {
        next(err)
    }
})


router.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    const { account, role, email, _id } = req.user
    res.json({ account, role, email, _id})
})
router.get('/api/auth/verify/:token', async (req, res, next) => {
    const { token } = req.params;
    try {
        //find user based on token
        const user = await User.findOne({ verificationLink: token }, { new: true });
        // return res.send(user)
        // if user not found return error 
        if(!user) return next(new Error('User not found'))

        // check that less than 24 hours has passed since token was set
        if( new Date(user.verificationDate) - Date.now() > 24 * 60 * 60 * 1000) {
            return next(new Error('This link has expired'))
        }

        await user.updateOne({
            verified: true,
            verificationLink: ''
        })
    } catch (error) {
        next(error)
    }
})

router.get('/test/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.json(error)
    }
})

module.exports = router;