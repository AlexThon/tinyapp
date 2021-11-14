


/**
 * GetUserInformation: usersDb - takes user database
 * and pass it to the enclosed functions.
 * The inner functions are: utility() - multipurpose function for checking the database
 * if the given id or email is in the database.
 * It returns user object or error object
 * checkUserEmail() - takes an email and return a user or error
 * The user can be retrieved by either the id and the email.
 * checkUserId() - takes user id and returns user or error
 *
 * ***/

const getUserInformation = (usersDb) => {

  const utility = (caseToTest, email) => {
    for (const id in usersDb) {
      if (usersDb[id][`${caseToTest}`] === email) {
        return {user: usersDb[id], error: null};
      }
    }
    return {user: null, error: "User not found!"};
  };

  const checkUserEmail = (email) => {
    return utility('email', email);
  };

  const checkUserId = (userId) => {
    return utility('id', userId);
  };
  // Takes email and password and return the user otherwise null
  const authenticateUser = (email, password) => {
    // destructure the  user object from checkUserEmail
    const { user, error} = checkUserEmail(email);
    if (user) {
      if (user.password === password) {
        return {user: user, error: null};
      }
    }
    return {user: null, error: error};
    
  };

  return {checkUserEmail, checkUserId, authenticateUser};
};

module.exports = getUserInformation;




