
// helper functions enclosure
// const bcrypt = require('bcryptjs');
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


