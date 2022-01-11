
// helper functions enclosure
const bcrypt = require('bcryptjs');
const getUsersInformation = (usersDb) => {

  const searchUtility = (property, value) => {
    for (const id in usersDb) {
<<<<<<< HEAD
      const user = usersDb[id]
      if (user[property] === value) {
=======
      if (usersDb[id][property.toString()] === value) {
>>>>>>> 3d7a80dd40a166d915444d53608d80bd85313dc8
        return usersDb[id];
      }
    }
    return null
  };
<<<<<<< HEAD
  const getUserByUserEmail = (email) => {
    return searchUtility('email', email);
  }
  const getUserById = (userId) => {
=======

  const checkUserEmail = (email) => {
    return searchUtility('email', email)
  };

  const checkUserId = (userId) => {
>>>>>>> 3d7a80dd40a166d915444d53608d80bd85313dc8
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

<<<<<<< HEAD
let b = getUsersInformation(usersDb)

// console.log(b.getUserByUserEmail("user@example.com"))


=======
>>>>>>> 3d7a80dd40a166d915444d53608d80bd85313dc8
