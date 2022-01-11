
// helper functions enclosure
const bcrypt = require('bcryptjs');
const getUsersInformation = (usersDb) => {

  const searchUtility = (property, value) => {
    for (const id in usersDb) {
      const user = usersDb[id]
      if (user[property] === value) {
        return usersDb[id];
      }
    }
    return null
  };
  const getUserByUserEmail = (email) => {
    return searchUtility('email', email);
  }
  const getUserById = (userId) => {
    return searchUtility('id', userId);
  };
  
  return {getUserByUserEmail, getUserById};
};

module.exports = getUsersInformation;


const usersDb = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync('123', 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync('123', 10)
  }
};

let b = getUsersInformation(usersDb)

// console.log(b.getUserByUserEmail("user@example.com"))


