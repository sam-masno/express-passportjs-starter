//   ******************* PASSPORT AUTHENTICATION ENDPOINTS *****************
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;

//require mongoose and models
const User = require('./main/models/User'); 


//GOOGLE STRATEGY
const google = new GoogleStrategy(
    {
        clientID: 'Google client ID here',
        clientSecret: 'GOOGE SECRET HERE',
        callbackURL: '/api/auth/google/callback',
        // proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const checkForUser = await User.findOne( { account: profile.id, authType: 'google' } );
            if(checkForUser) {
                // console.log('user exists')
                done(null, checkForUser);
            }
            else {
                const newUser = await User.create({
                    account: profile.id,
                    authType: 'google',
                    name: profile.displayName,
                }); 
                // console.log(newUser)
                done(null, newUser)
            } 
        } catch (error) {
            done(new Error(err.message), false)
        }
                 
    }   
)

// FACEBOOK STRATEGY
const facebook = new FacebookStrategy({
    clientID: 'Facebook client ID here',
    clientSecret: 'Facebook client secret here',
    callbackURL: "/api/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const checkForUser = await User.findOne({ account: profile.id, authType: 'facebook'})
    if(checkForUser) {
        done(null, checkForUser)

    } else {
        const newUser = await User.create({
            account: profile.id,
            name: profile.displayName,
            authType: 'facebook'
        })
        done(null, newUser)
    }
  }
);

//LOCAL STRATEGY
const local = new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done)  => {
        try {
            const user = await User.findOne({ email, authType: 'local' }).select('+password')
            //throw error if no user
            if(!user) throw new Error('Email not found')
    
            if(!user.verified) throw new Error('Account not verified. Please check your email and follow the link')
          
            //use usermethod to match passwords
            const verify = await user.matchPassword(password);
    
            if(!verify) throw new Error('Incorrect password')
    
            done(null, user)
        } catch (error) {
            done(error, false)
        }
        //check if email exists with local authType

    }
  );


//*************** */ PASSPORT RUN FILE *******************

const passport = require('passport');


// create unique identifier for cookie based user auth


//apply strategies to passport
module.exports = () => {
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    })

    passport.use(google);
    passport.use(facebook);
    passport.use(local)
}