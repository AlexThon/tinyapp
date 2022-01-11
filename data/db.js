// const urlsForUserID = (id) => {
//   const userUrls = {};
 
//   for (let shortURL in urlDatabase) {
//     let userId = urlDatabase[shortURL].userID;
//     if (id === userId) {
//       userUrls[shortURL] = urlDatabase[shortURL];
//     }
//   }
//   return userUrls;
// };


// // SHORT URLS OBJECT DATABASE
// const urlDatabase = {
//   b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
//   i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW"}
// };

// module.exports = {
//   urlsForUserID,
//   urlDatabase
// }

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },

  // helper functions
  getLongUrl: function(shortURL) {
    return this[shortURL].longURL;
  },
  setLongUrl: function (shortURL, longURL) {
    this[shortURL].longURL = longURL;
  },
  urlsForUserID: function (id) {
    let tmp = {};
    for (const url in this) {
      if (this[url].userID === id)
        tmp[url] = this[url];
    }
    return tmp;
  }
};

module.exports = urlDatabase