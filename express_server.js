const express = require('express');
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const USERS = require('./data/users');
const getUserInformation = require('./getUser');

const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['let\'s see if I can implement session=cookie correctly', 'key2'],
}));


// SHORT URLS OBJECT DATABASE
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW"}
};

const generateRandomString = () => Math.random().toString(36).substring(2,8);



// ROUTES

app.get('/', (req, res) => {
  res.send('Hey this is home');
});

app.get("/hello", (req, res) => {
  return res.send("<html><h4>Hello <b>there</b></h4></html>\n");
});

app.get('/urls', (req, res)=> {
  const userId = req.session['user_id'];

  const userInfo = getUserInformation(USERS);
  // check user id in the userdatabase
  const {user, error} = userInfo.checkUserId(userId);
 
  if (user) {
    // reach here if the user is not registered
    const templateVars = {urls: urlDatabase, user };
    return res.render('urls_index', templateVars);
  }
  res.send('Login to see your urls');
});

/**
 * This route redirects users to the login page
 * when they try to access /urls/new while not login
 *
*/
// PRESENTS AN EMPTY FORM TO THE CLIENT
app.get('/urls/new', (req, res) => {
  const userId = req.session['user_id'];
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserId(userId);
  
  // return login page if the user Id is not in the db or cookie
  if (error) {
    return res.redirect('/login');
  }
  const templateVars = {user};
  //only gets here when the user is login
  res.render('urls_new', templateVars);
});


// CREATE AND ADD URL TO DB
app.post("/urls", (req, res) => {
  const userId = req.session['user_id'];
  if (userId) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
    res.redirect(`/urls/${shortURL}`);
  }
  res.send("You are not logged-in !");
});


app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = urlDatabase[req.params.shortURL];
  
  if (!shortURL) {
    return res.send("Url is not valid!!");
  }
  if (!userId) {
    return res.send('You need to login first!');
  }
  if (userId !== urlDatabase[req.params.shortURL]['userId']) {
    return res.send('You do not own this url');
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], 'user': USERS[userId]};
  return res.render("urls_show", templateVars);
  
});

// READ/DISPLAY LONG URL
//catch invalid ID provided
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  try {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  } catch (error) {
    res.render('invalidID');
  }
});


// DISPLAY FORM FOR REGISTRATION
app.get('/register', (req, res) => {
  const userInfo = getUserInformation(USERS);
  const userId = req.session['user_id'];
  const {user, error} = userInfo.checkUserId(userId);
  const templateVars = {user};
  return res.render('registration-form', templateVars);
});



/**
 * This endpoint adds a new user object to users database
 * where each id is generated randomly
 * After adding the user, the user_id cookie containing the user's newly generated ID is set.
 * then the route is redirected the /urls page.
  **/

app.post('/register', (req, res) => {
  const userId = generateRandomString();

  const { email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  //gets user object
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserEmail(email);

  // User must add email and password to register
  if (!password || !email) {
  
    res.satus(400).send("All inputs are required.");
  }
  // email is already in the database
  if (!error) {
    res.satus(400).send('Your email is registered! Try to login');
  }
  
  // register new user
  USERS[userId] = {
    id: userId,
    email:email,
    hashedPassword: hashedPassword
  };
  // set session coookies
  req.session.user_id = userId;
  return res.redirect("/urls");
});



// DELETE URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.session.user_id;
  const shortURL = urlDatabase[req.params.shortURL];

  if (!shortURL) {
    return res.send("Invalid url!!");
  }

  if (!userId) {
    return res.send('You need to login to delete the url!');
  }
  if (userId !== urlDatabase[req.params.shortURL]['userId']) {
    return res.send('Unathorized user!');
  }
  delete urlDatabase[shortURL];
  return res.redirect('/urls');
});


// HANDLES EDIT BUTTON
app.post('/urls/:id/edit', (req, res) => {
  const userId = req.session.user_id;
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserId(userId);
  if (!user) {

    const  shortURL = req.params.id;
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect('/urls');
  }
  urlDatabase[req.params.id].longURL = req.body;
  res.redirect(`/urls/${req.params.id}`);
});



app.get('/login', (req, res) => {
  const userInfo = getUserInformation(USERS);
  const userId = req.session.user_id;
  const {user, error} = userInfo.checkUserId(userId);
  if (userId) {
    const templateVars = {user};
    res.render('login', templateVars);
  }
  res.send("You are not logged-in!");
});

/**
* If a user with the e-mail provided cannot be found, it returns a response with a 403 status code.
* If a user with that e-mail address is located, the password given in the form with the existing user's password is compared.
* If it does not match, a response with a 403 status code is send.
* If both checks pass, the user_id cookie is set with the matching user's random ID, then redirects to /urls.
*/

app.post('/login', (req, res) => {
  try {
    const { email, password} = req.body;
    const userInfo = getUserInformation(USERS);
    const {user, error} = userInfo.checkUserEmail(email);
    if (error) {
      
      res.status(403).send('Email or password is not correct');
      return;
    }
    if (bcrypt.compareSync(password, user.hashedPassword)) {
      req.session.user_id = user.id;
      // user is directed here when login
      return res.redirect('/urls');
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    
    return res.status(500).send("Error in getting the user");
  }

});


// HANDLE LOGOUT BY RESETTING COOKIE
app.post('/logout', (req, res) => {
  // clear session cookie
  delete req.session.user_id;
  return res.redirect('/register');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



