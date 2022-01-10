
// helper functions enclosure
const bcrypt = require('bcryptjs');
const getUsersInformation = (usersDb) => {

  const searchUtility = (property, value) => {
    for (const id in usersDb) {
      if (usersDb[id][property.toString()] === value) {
        return usersDb[id];
      }
    }
    return null
  };

  const checkUserEmail = (email) => {
    return searchUtility('email', email)
  };

  const checkUserId = (userId) => {
    return searchUtility('id', userId);
  };
  
  return {checkUserEmail, checkUserId};
};

module.exports = getUsersInformation;



