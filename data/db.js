const urlsForUserID = (id) => {
  const userUrls = {};
 
  for (let shortURL in urlDatabase) {
    let userId = urlDatabase[shortURL].userID;
    if (id === userId) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};


// SHORT URLS OBJECT DATABASE
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW"}
};

module.exports = {
  urlsForUserID,
  urlDatabase
}