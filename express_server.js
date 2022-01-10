// --------------------------------------REQUIREMENTS

const express = require('express');
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const generateRandomString = () => Math.random().toString(36).substring(2,8);
const getUsersInformation = require("./getUser")

const {urlsForUserID, urlDatabase} = require('./data/db')
const USERS = require('./data/users') ;
const {checkUserEmail, checkUserId} = getUsersInformation(USERS);


// --------------------------------------SERVER SETTINGS/ MIDDLEWARE

const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['let\'s see if I can implement session=cookie correctly', 'key2'],
}));


// -------------------------------------- THE ROUTES/ENDPOINTS
// HOMEPAGE
app.get('/', (req, res) => {
  return res.redirect('urls')
});



/**
 * This route redirects users to the login page
 * when they try to access /urls/new while not login
 *
*/

// URLS VIEWS ROUTES

app.get('/urls', (req, res)=> {
  
  const userId = req.session['user_id'];
  if(!userId) {
    return res.redirect('/login')
  }

  const validUser = checkUserId(userId);
  if (!validUser) {
    return res.redirect('/login')
  }

  const templateVars = {
    urls: urlsForUserID(userId),
    user: validUser
  };
  return res.render('urls_index', templateVars);
});


// PRESENTS AN EMPTY FORM TO THE CLIENT
app.get('/urls/new', (req, res) => {
  
  const userId = req.session['user_id'];
  if(!userId) {
    return res.redirect('/login')
  }

  const validUser = checkUserId(userId);
  if (!validUser) {
    return res.redirect('/login')
  }

  const templateVars = {
    user: validUser
  };
  return res.render('urls_new', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session['user_id'];
  if(!userId) {
    return res.redirect('/login')
  }

  const validUser = checkUserId(userId);
  if (!validUser) {
    return res.redirect('/login')
  }

  const {shortURL} = req.params
  const templateVars = {
    user: validUser,
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL
  };
  return res.render('urls_show', templateVars);
  
});

// READ/DISPLAY LONG URL
//catch invalid ID provided
app.get('/u/:shortURL', (req, res) => {
  const {shortURL} = req.params;
  const longURL = urlDatabase[shortURL].longURL;
  if (!longURL) {
    return res.render("invalidID")
  }
  return res.redirect(longURL);
});

// AUTH VIEWS ROUTES

app.get('/register', (req, res) => {
  const userId = req.session['user_id'];
  if(userId) {
    return res.redirect('/urls')
  }

  const templateVars = {user: USERS[req.session.user_id]};
  return res.render('registration-form', templateVars);
});


app.get('/login', (req, res) => {  
  const userId = req.session['user_id'];
  if(userId) {
    return res.redirect('/urls')
  }

  const templateVars = {user: null};
  return res.render('login', templateVars);
});



// API ROUTES URLS
// CREATE AND ADD URL TO DB
app.post("/urls", (req, res) => {
  
  const userId = req.session['user_id'];
  if(!userId) {
    return res.status(400).send("You need to be login")
  }

  const validUser = checkUserId(userId);
  if (!validUser) {
    return res.status(400).send("You are not a valid user");
  }

  const {longURL} = req.body;
  if(!longURL) {
    return res.status(400).send("You need to pass a longURL");
  }

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: validUser.id
  };

  return res.status(201).redirect(`/urls/${shortURL}`);
});

// app.post('urls:shortURL')
// HANDLES EDIT BUTTON
app.post('/urls/:shortURL', (req, res) => {
  const userId = req.session['user_id'];
  if(!userId) {
    return res.status(400).send("You need to be login to edit urls")
  }

  const validUser = checkUserId(userId);
  if (!validUser) {
    return res.status(400).send("You are not a valid user");
  }

  const  { shortURL } = req.params;
  if (!shortURL && !urlDatabase[shortURL]) {
    return res.status(400).send("shortURL is not valid");
  }

  urlDatabase[shortURL].longURL = req.body.longURL;
  //res.redirect(`/urls/${shortURL}`);
  res.redirect('/urls')
});

// DELETE URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const user_id = req.session.user_id;
  const userUrls = urlsForUserID(user_id);
  if (Object.keys(userUrls).includes(req.params.shortURL)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(401).send("Not authorized to delete this short URL.");
  }
 
});


// API ROUTES AUTH

app.post('/register', (req, res) => {
  const userId = generateRandomString();

  const { email, password} = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  
  //gets user object
  
  const user = checkUserEmail(email);

  // User must add email and password to register
  if (!password || !email) {
  
    res.status(400).send("All inputs are required.");
  }
  // email is already in the database
  if (!user) {
    res.send('Your email is registered!...<a href="/login">login here</a>');
  }
  
  // register new user
  USERS[userId] = {
    id: userId,
    email:email,
    password: hashedPassword
  };
  // set session coookies
  req.session.user_id = userId;
  return res.redirect("/urls");
});



/**
* If a user with the e-mail provided cannot be found, it returns a response with a 403 status code.
* If a user with that e-mail address is located, the password given in the form with the existing user's password is compared.
* If it does not match, a response with a 403 status code is send.
* If both checks pass, the user_id cookie is set with the matching user's random ID, then redirects to /urls.
*/

app.post('/login', (req, res) => {
  const {email, password} = req.body;
 
  const user = checkUserEmail(email)
  console.log("user:: ", user)

  if(!email) {
    return res.status(400).send('Add correct email');
  }

  if(!password) {
    return res.status(400).send('Password is required!');
  }
  
  if (bcrypt.compareSync(password, user.password)){
    req.session.user_id = user.id;
    return res.redirect('/urls');
  }
  return res.redirect('/login');
});


// HANDLE LOGOUT BY RESETTING COOKIE
app.post('/logout', (req, res) => {
  // clear session cookie
  req.session = null;
  return res.redirect('/urls');
});


// -------------------------------------- THE LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



