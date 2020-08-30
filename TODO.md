# Monday

- Build an express server with the following features;

  <!-- --//connect to a mongo database-- -->

  <!-- --// create a Users mongoose/model system-- -->

  // before we save a record
      <!-- //hash the plain text password given before you save a user to the database you save a user to the database -->

  <!-- // create a method in the schema to authenticate a user using the hashed password -->

  <!-- // create a method in the schema to generate a token following a valid login -->

  // Create a module to house all of routes for the authentication system
    <!-- - create a post route for /signup -->
      <!-- - accepts either a JSON object or FORM Data with the keys "username" and "password" -->
      <!-- - created a new user record in a Mongo database -->

  //Create a POST route for /signin
    <!-- - router.post('/signin', basicAuth, (req, res) => {}); -->
    <!-- - Uses middleware(Basic Authentication to validate the user
    - When Validated, send a JSON object as the response with the following properties:
      - token : the token generate by the users model
      - user : the users database record -->
      <!-- - additionally, set a cookie and a token header on the response, with the token as the value  __DONE__ -->

  //Create a GET route for /user that returns a JSON object with all users

  //Basic authentication middleware
    - Reads the encoded username and password from the authentication header
    - Checks the Users model to see if this is a valied user and the right password
    - If the user is valid, generate a toked and append it to the request object
      - If valid call next();
      - Otherwise call next(); with an error as an argument. 

***************************************************************************

Testing

- You should manually test your routes using httpie from the command line or an appllication such as postman or insomnia.  You are required to write automated test as well;

  - POST to /signup to create a new user
  - POST to /signin to login as a user(use basic auth)
  - Need tests for auth middleware and the routes
    - Does the middleware function(send it a basic header)
    - Do the routes assert the requirements(signup/signin)


****************************************************************************


# Tuesday

- Noted here are the relevant changes you’ll need to make to your server to complete Phase 2:

  - Add a new /oauth route to the auth router
    In order to handle OAuth requests, we will need a route that can receive the initial code from the OAuth server and a middleware module that will handle the handshaking process.

    This should be a GET route
    i.e. app.get('/oauth', ...)

  - OAuth Middleware Module
  In order to handle the handshake process that is the heart of OAuth, we need a new middleware module that will, when added to the /oauth route, will complete the task of authenticating the user.

  - Create a new middleware module called oauth.js in your auth module’s middleware folder

  - This should be required by your auth router and attached inline to the /oauth route:
    - app.get('/oauth', OAuthMiddleware, ...)

  - This middleware will need to do the following:

    - Exchange the code received on the initial request for a token from the Provider
    - Use the token to retrieve the user’s account information from the Provider
    - Create/Retrieve an account from our Mongo users database matching the user’s account (email or username) using the users model
    - Generate a token using the users model
    - Add the token and the user record to the request object
    - If it is successful, use next() to continue on to the actual route handler
    - If not, the middleware should invoke the error handler by calling next() with an error
  
  - Users Model
    - Once the handshaking process has completed in the middleware method, the middleware will need our users model to be able to create a new account for the user that was just authenticated or retrieve an existing account, if this is a returning users.

    - Create a new method that will do a lookup for the account by email or username
    - If found, return it
    - If not, create a new account for the user and return that

**********************************************

- Testing 
  - You are not required to write automated tests for the /oauth route or the middleware, as this will end up requiring (and invoking) actual user requests at the OAuth Provider’s API which we don’t want.

# Lab 14 
  - - /public
  - anyone can get in
- /private 
  - only validated users get in
- /readonly 
  - user must have 'read' capabilities
  - aka be a 'user' role or above
- /create
  - user must have 'create' capabilities
  - aka be a 'writer' role or above
- /update
  - user must have 'update' capabilities
  - aka be an 'editor' role or above
- /delete
  - user must have 'delete' capabilities
  - aka must be an 'admin'  
