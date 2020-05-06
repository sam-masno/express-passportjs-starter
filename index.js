//******  ISH ***************/
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');

//routers
const authRouter = require('./AuthRoutes');
const app = express();

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

//apply route handlers
app.use(authRouter)

app.use(( err, req, res, next) => {
    const { message, status } = err
    err.stack = null;
    res.status( status || 500).send({ message : message || 'Server error'})
})

app.listen(process.env.PORT || 5000, () => console.log('app running on port 5000'))