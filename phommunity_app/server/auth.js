// import jwt
const jwt = require('jsonwebtoken');

//import the db functions
const dbLib = require('./dbFunctions');

/**
 * Authenticates a user by decoding the JWT
 */

const authenticateUser = async (token, key) =>{
    // console.log(token)
    // check the params
    if(token === null||key === null||!key){
        return false;
    }
    try{
        const decoded = jwt.verify(token, key);
        // verify the user
        const allUsers = await dbLib.getAllUsers();
        allUsers.forEach((element) => {
            if (element.user_name === decoded.username) {
                matched = true;
              }
            }
          );
        if(!matched){
            return false;
        }

        return true;
    }catch(err){
        return false;

    }
}

module.exports = { authenticateUser };

