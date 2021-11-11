/**
 * Lookup the user object in the users object using the user_id cookie value
 * Pass this user object to your templates via templateVars.
 * Update the _header partial to show the email value from the user object instead of the username.
 * ***/

const getUser = (users, userId) => {
  for (let id in users) {
    if (id === userId) {
      return {user: users[userId], error: null};
    } else {
      return {user: null, error: "User not found!"};
    }
  }
  
};

module.exports = getUser;