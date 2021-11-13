const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const USERS = require('./data/users');
const getUserInformation = require('./helper/getUser');




app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');



const urlDatabase = {
  "9sm5xK": "http://www.google.com",
  "b2Vxn2": "http://www.github.com",
  "8sm5xK": "http://www.lighthouselabs.ca"
};

app.get('/', (req, res) => {
  res.send('Hello!');
});


app.get('/urls', (req, res)=> {
  const userId = req.cookies['user_id'];
  // console.log(USERS[userId]);
  //console.log(username);
  //const user = USERS[userId];

  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserId(userId);

  const templateVars = {urls: urlDatabase, user };

  res.render('urls_index', templateVars);
});


// Display a empty form to the client
app.get('/urls/new', (req, res) => {
  
  const userId = req.cookies['user_id'];
  // const user = USERS[userId];
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserId(userId);
  const templateVars = {user};

  res.render('urls_new', templateVars);
});

// CREATE AND ADD URL TO DB
app.post("/urls", (req, res) => {
  const urlId = Math.random().toString(36).substring(2,8);
  urlDatabase[urlId] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

// READ short and long URLS
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies['user_id'];
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserId(userId);
  //const user = USERS[userId];
  // const templateVars = {user};

  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  // const username = req.cookies["username"];
  const templateVars = { shortURL: shortURL, longURL: longURL, user};
  res.render("urls_show", templateVars);
});

// READ/DISPLAY LONG URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);

});



// DISPLAY FORM FOR REGISTRATION
app.get('/register', (req, res) => {
  const userInfo = getUserInformation(USERS);
  const userId = req.cookies["user_id"];
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
  // const email = req.body.email;
  // const password = req.body.password;

  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.checkUserEmail(email);
  

  if (!userId || !email) {
    res.statusCode = 400;
    return res.send("Fill in the form");
  }

  // check if user is found
  if (!error) {
    console.log("Error: is", error);
    res.statusCode = 400;
    return res.send("Email is taken");
  }
  
  USERS[userId] = {
    id: userId,
    email:email,
    password: password
  };
  res.cookie('user_id', userId);
  return res.redirect("/urls");
});



// UPDATE LONG URL
app.post('/urls/:id', (req, res) => {
  const  shortURL = req.params.id;
  const content = req.body;
  urlDatabase[shortURL] = content.longURL;
  
  res.redirect('/urls');
  
});


// DELETE URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  return res.redirect('/urls');
});

// handle EDIT BUTTON
app.post('/urls/:id/edit', (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
});

// ADD LOGIN BUTTON
// app.post('/login', (req, res) => {
//   console.log(req.body);
//   const username = req.body.username;
//   if (username) {
//     res.cookie('username', username);
//   }
//   // redirect or render ?
//   //
//   return res.redirect("/urls");
// });

// ADD LOGIN BUTTON

app.get('/login', (req, res) => {
  const userInfo = getUserInformation(USERS);
  const userId = req.cookies['user_id'];
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
  // destructure req.body to get both email and password
  const { email, password} = req.body;
  const userInfo = getUserInformation(USERS);
  const {user, error} = userInfo.authenticateUser(email, password);
  
  if (error) {
    res.statusCode = 403;
    // send user back to login form
    return res.redirect('/login');
  }
  res.cookie('user_id', user.id);
  res.redirect('/urls');
  
});

// HANDLE LOGOUT BY RESETTING COOKIE
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



