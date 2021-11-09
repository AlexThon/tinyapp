const express = require('express');
const app = express();
const PORT = 8080;

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

app.get("/urls/:shortURL", (req, res) => {
  const id = req.params.shortURL;
  console.log(typeof id);
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  const templateVars = { shortURL: id, longURL: longURL};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
