


/**
 * Lookup the user object in the users object using the user_id cookie value
 * Pass this user object to your templates via templateVars.
 * Update the _header partial to show the email value from the user object instead of the username.
 * ***/

const getUserInformation = (usersDb) => {

  const utility = (caseToTest, email) => {
    for (const id in usersDb) {
      if (usersDb[id][`${caseToTest}`] === email) {
        return {user: usersDb[id], error: null};
        
      }
    }
    return {user: null, error: "Email not found!"};
  };

  const checkUserEmail = (email) => {
    return utility('email', email);
  };

  const checkUserId = (userId) => {
    return utility('id', userId);
  };
  
  return {checkUserEmail, checkUserId};
};

module.exports = getUserInformation;


// const users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur"
//   },
//   "user2RandomID": {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   }
// };


module.exports = getUserInformation;

// let email = "user1@example.com";
// let id = "user2RandomID";
// const result = getUserInformation(users);
// const {user, error} = result.checkUserEmail(email);

//console.log(user.email);

// console.log("result for id: ", result.checkUserId(id));