# express-passportjs-starter
This is a RESTful API authentication system with passportjs equipped to handle authentication with google, facebook, and verified email.
Cookies are used to serialize users.

## Installation
navigate to root directory and run `npm install`

## Add Credentials
The following credentials will be required at the specified location. These credentials can be created in a developer account for the respective provider
1. passport.js line 13: Google Oauth Client ID
2. passport.js line 14: Google Oauth Client Secret
3. passport.js line 43: Facebook Oauth Client ID
4. passport.js line 44: Facebook Oauth Client Secret
5. mailer.js line 2: Sendgrid API Key

## MongoDb URI String
This API will need a running instance of MongoDB. The following is required. <br>
db.js line 5 : MongoURI string

## Routes 
`GET /api/auth/user` - returns info about current user in passport session
<br> 
`GET /api/auth/logout` - clears current passport session for user <br>
`GET /api/auth/google/` - init google Oauth flow <br>
`GET /api/auth/google/callback` - receives callback from Oauth after permission granted <br>
`GET /api/auth/facebook/` - init facebook Oauth flow <br>
`GET /api/auth/facebook/callback` - receives callback from Oauth after permission granted <br>
`POST /api/auth/register` - creates new User in database. <br>
```
// required object for /api/auth/register
{
  name: 'User Name Here',
  email: 'user-email@email.com',
  password: 'password123'
}
```
`POST /api/auth/login` - Authenticates only accounts registered at 'api/auth/register' <br>
```
//required object for /api/auth/login
{
  email: 'user-email@email.com',
  password: 'password123'
}
```
`GET /api/auth/verify/:token` - The verifies email registered accounts<br> 
`GET /test/users`- Just a test route to view all users <br>

## Usage
After credentials are entered, navigate to root directory and run `nodemon index.js`.
The server will now be running on port 5000

## The Flow
Google and Facebook authenticaton routes will be initiated from a link in the client. <br>
When approved, passport will attempt to find an user associated with that account, if not create a new one.<br>
These accounts will immediatley have access to passport credentials.
<br>
<br>
Email/Password accounts are registered at `/api/auth/register` and by default the verified property is false. <br>
When an account is created, a random verification link is generated and sent to the email registered. <br>
A `GET` request to this link will update the the verified property of account to true. <br>
The user will not be able to receive passport creds until verified




