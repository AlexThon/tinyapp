const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser);

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
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});


// Display a empty form to the client
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// CREATE AND ADD URL TO DB
app.post("/urls", (req, res) => {
  const newKey = Math.random().toString(36).substring(2,8);
  urlDatabase[newKey] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

// READ short and long URLS
app.get("/urls/:shortURL", (req, res) => {
  const id = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { shortURL: id, longURL: longURL};
  res.render("urls_show", templateVars);
});

// READ/DISPLAY LONG URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);

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
  res.redirect('/urls');
});

// handle EDIT BUTTON
app.post('/urls/:id/edit', (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
});

// ADD COOKIE
app.post('/login', (req, res) => {
  console.log("content is: ", req.body);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



