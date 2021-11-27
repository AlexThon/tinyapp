
// enclosed object with helper functions

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




