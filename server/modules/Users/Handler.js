import {
  findUserByEmail,
  userModel,
  saveUser,
  comparePassword,
  findUserByUserId,
  findUserByUserIdAndUpdate,
  findUserByUserType,
  findUserByUserIdAndUpdateApprover
} from "./Model";
import { genToken } from "../../utils/utils";

const createNewUser = (user_id, email,first_name,last_name,mobile_number, password) => {
  return Promise.all([findUserByEmail(email), findUserByUserId(user_id)])
    .then(result => {
      result = result.filter(ele => ele === null);
      if (result.length === 2) {
        const newUser = new userModel({
          user_id: user_id,
          email: email,
          first_name:first_name,
          last_name:last_name,
          full_name:first_name+last_name,
          mobile_number:mobile_number,
          password: password
        });
        return saveUser(newUser);
      } else {
        return Promise.reject({
          statusCode: 409,
          message: 'User with this Email/User ID already exists'
        });
      }
    }).then(user => {
      return Promise.resolve({
        statusCode: 201,
        message: "New User Created Successfully"
      });
    }).catch(error => {
      return Promise.reject(error);
    });
};


const userLogin = (userid_email, password) => {
  let user_obj;
  return Promise.all([findUserByEmail(userid_email), findUserByUserId(userid_email)])
    .then(user => {
      user = user.filter(ele => ele !== null);
      user_obj = user;
      if (!user.length) {
        return Promise.reject({
          statusCode: 404,
          message: "No user found with this User/Email ID"
        });
      } else {
        return comparePassword(password, user[0].password);
      }
    })
    .then(match => {
      if (!match) {
        return Promise.reject({
          statusCode: 401,
          message: "Password didn't match"
        });
      } else {
        console.log(user_obj[0]);
        const token = genToken(user_obj[0]);
        return Promise.resolve({
          
          
          token: token,
          user: {
           
            user_id: user_obj[0].user_id,
            email: user_obj[0].email,
            first_name:user_obj[0].first_name,
            last_name:user_obj[0].last_name,
            full_name:user_obj[0].full_name,
            mobile_number:user_obj[0].mobile_number
            
          }
        });
      }
    });
};





const findByUserId = (user_id) => {
  return findUserByUserId(user_id)
    .then(user => {
      if (user) {
        let user1 = user.toObject();
        delete user1['password'];
        delete user1['_id'];
        delete user1['__v'];
        console.log(user1);
        
        return Promise.resolve({
          statusCode: 200,
          message: "User Found",
          data: user1
        });
      } else {
        return Promise.reject({
          statusCode: 404,
          message: `No such user ${user_id} exists`
        });
      }
    });
};

const getUsers = (user_type) => {
  return findUserByUserType(user_type)
    .then(results => {
      if (results.length) {
        return Promise.resolve({
          statusCode: 200,
          success: true,
          message: 'Users details are',
          data: results
        });
      } else {
        return Promise.resolve({
          statusCode: 200,
          success: true,
          message: 'No users exists',
          data: []
        });
      }

    })
    .catch(err => {
      return Promise.reject({
        statusCode: 500,
        success: true,
        message: 'Users details are',
        error: err
      });
    });
};


module.exports = {
  createNewUser,
  userLogin,
  findByUserId,
  getUsers,
};
