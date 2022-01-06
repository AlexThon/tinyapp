
// helper functions enclosure
const bcrypt = require('bcryptjs');
const getUsersInformation = (usersDb) => {

  const searchUtility = (property, value) => {
    for (const id in usersDb) {
      console.log('Search utility, wanna see email', usersDb[id][property.toString()] )
      if (usersDb[id][property.toString()] === value) {
        return usersDb[id];
      }
    }
    return null
  };

  // const usersDb = {
  //   "userRandomID": {
  //     id: "userRandomID",
  //     email: "user@example.com",
  //     password: bcrypt.hashSync('123', 10)
  //   },
  //   "user2RandomID": {
  //     id: "user2RandomID",
  //     email: "user2@example.com",
  //     password: bcrypt.hashSync('123', 10)
  //   }
  // };

  const checkUserEmail = (email) => {
    return searchUtility('email', email)
  };

  const checkUserId = (userId) => {
    return searchUtility('id', userId);
  };
  
  return {checkUserEmail, checkUserId};
};

module.exports = getUsersInformation;



// const searchUtility = (property, value, usersDb) => {
//   for (const id in usersDb) {
//     console.log("test::::",usersDb[id][property])
    
//     if (usersDb[id][property] === value) {
//       return usersDb[id];
//     }
//   }
//   return null
// };


// const checkUserEmail = (email) => {
//   return searchUtility('email', 'email');
// };



// const usersDb = {
//     "userRandomID": {
//       id: "userRandomID",
//       email: "user@example.com",
//       password: bcrypt.hashSync('123', 10)
//     },
//     "user2RandomID": {
//       id: "user2RandomID",
//       email: "user2@example.com",
//       password: bcrypt.hashSync('123', 10)
//     }
//   };

//   searchUtility("email", 'email', usersDb)
 
