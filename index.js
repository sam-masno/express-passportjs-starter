/******  AUTH STARTER ************* */
const express = require('express');

//routers
const app = express();

// initialize cookie sessions, passport and mongodb
startUp(app);

//apply route handlers
routers(app);

//apply error catch
errorHandler(app);

app.listen(process.env.PORT || 5000, () => console.log('app running on port 5000'))

//*************       SETUP FUNCTIONS **************************8 */

// if any bugs check in passport.js and db.js
function startUp(app) {
    const morgan = require('morgan');
    const bodyParser = require('body-parser');
    const cookieSession = require('cookie-session');
    const passport = require('passport');
    app.use(morgan('dev'));
    app.use(bodyParser.json())
    // init cookieSessions to allow cookie traffic
    app.use(
        cookieSession({
            maxAge: 5 * 24 * 60 * 60 * 1000,
            keys: ['COOKIE KEY HERE']
        })
    )
    //initialize passport and use session
    app.use(passport.initialize());
    app.use(passport.session())
    //run passport and db as setup functions
    require('./db')(); 
    require('./passport')()
}

// if any bugs check in ./AuthRoutes.js
function routers(app) {
    app.use(require('./AuthRoutes.js'))
}

// this uses no external resources
function errorHandler(app) {
    app.use(( err, req, res, next) => {
        const { message, status } = err
        err.stack = null;
        res.status( status || 500).send({ message : message || 'Server error'})
    })
}