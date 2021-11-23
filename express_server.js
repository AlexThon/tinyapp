const express = require('express');
const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');

const USERS = require('./data/users');
const getUserInformation = require('./getUser');

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['let\'s see if I can implement session=cookie correctly', 'key2'],
}));

app.set('view engine', 'ejs');

// SHORT URLS OBJECT
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};


// ROUTES

app.get('/', (req, res) => {
  res.redirect('/register');
});


app.get('/urls', (req, res)=> {
  const userId = req.session['user_id'];
  const userInfo = getUserInformation(USERS);

  const {user, error} = userInfo.checkUserId(userId);
  const templateVars = {urls: urlDatabase, user };

  if (error) {
    // need to add prompt page for non logged in users
    return res.redirect('/register');
  }
  res.render('urls_index', templateVars);
});


// CREATE AND ADD URL TO DB
app.post("/urls", (req, res) => {
  // Generates unique short url
  const userInfo = getUserInformation(USERS);
  const urlId = userInfo.urlId();
  urlDatabase[urlId] = {longURL: req.body.longURL, userID: Math.random().toString(36).substring(2,8) };
  console.log(urlDatabase);
  res.redirect('/urls');
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


// READ SHORT AND LONG URLS
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session['user_id'];
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserId(userId);

  if (error) {
    res.send("Edit not allowed");
  }
  
  // retrieve the urls and use it to get long url
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  const templateVars = { shortURL: shortURL, longURL: longURL, user};
  
  res.render("urls_show", templateVars);
});

// READ/DISPLAY LONG URL
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
 * This endpoint should add a new user object to the global users object
 * The user object should include the user's [id], [email] and [password]
 * generate a random user ID
 * After adding the user, set a user_id cookie containing the user's newly generated ID.
 * Redirect the user to the /urls page.
 * Users:  {
 * userRandomID: {
 *  id: 'userRandomID',
 *  email: 'user@example.com',
 *   password: 'purple-monkey-dinosaur'
 * },
 * user2RandomID: {
 *  id: 'user2RandomID',
 *  email: 'user2@example.com',
 *  password: 'dishwasher-funk'
 *}
 *}
 * If e-mail or password are empty strings response with the 400 status code.
 *
 *
  **/

app.post('/register', (req, res) => {
  const userId = Math.random().toString(36).substring(2,8);
  const { email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserEmail(email);
  
  if (!userId || !email) {
    res.statusCode = 400;
    res.render('fillForm');
  }
  // check if user is found
  if (!error) {
    res.statusCode = 400;
    // custom html error display
    res.render('invalidEmail');
  }
  
  USERS[userId] = {
    id: userId,
    email:email,
    hashedPassword: hashedPassword
  };
  // set session coookies
  req.session.user_id = userId;
  return res.redirect("/urls");
});



// UPDATE LONG URL
app.post('/urls/:id', (req, res) => {
  const  shortURL = req.params.id;
  const content = req.body;
  urlDatabase[shortURL] = {longURL: content.longURL, id: Math.random().toString(36).substring(2,8)};
  res.redirect('/urls');
  
});


// DELETE URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  return res.redirect('/urls');
});

// HANDLES EDIT BUTTON
app.post('/urls/:id/edit', (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
});


app.get('/login', (req, res) => {
  const userInfo = getUserInformation(USERS);
  const userId = req.session.user_id;

  const {user, error} = userInfo.checkUserId(userId);
  const templateVars = {user};
  
  res.render('login', templateVars);
});

/**
 *  If a user with that e-mail cannot be found, return a response with a 403 status code.
    If a user with that e-mail address is located, compare the password given in the form with the existing user's password. If it does not match, return a response with a 403 status code.
    If both checks pass, set the user_id cookie with the matching user's random ID, then redirect to /urls.
*/

app.post('/login', (req, res) => {
  try {
    const { email, password} = req.body;
    const userInfo = getUserInformation(USERS);
    const {user, error} = userInfo.checkUserEmail(email);
    if (error) {
      res.statusCode = 403;
      res.send('Email or password is not correct');
      
    }
    if (bcrypt.compareSync(password, user.hashedPassword)) {
      req.session.user_id = user.id;
      res.redirect('/urls');
    } else {
      res.send('wrong password !');
    }
  } catch (error) {
    res.statusCode = 500;
    res.send("Error in getting the user");
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



