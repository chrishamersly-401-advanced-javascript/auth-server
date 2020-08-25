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


