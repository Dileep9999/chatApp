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

const createNewUser = (user_id, email, password) => {
  return Promise.all([findUserByEmail(email), findUserByUserId(user_id)])
    .then(result => {
      result = result.filter(ele => ele === null);
      if (result.length === 2) {
        const newUser = new userModel({
          user_id: user_id,
          email: email,
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
        const token = genToken(user_obj[0]);
        return Promise.resolve({
          token: token,
          user: {
            email: user_obj[0].email,
            user_id: user_obj[0].user_id,
            user_type: user_obj[0].user_type
          }
        });
      }
    });
};


const grantApprover = (candidate_user_id, user_id, approver_permission) => {
  return findUserByUserId(candidate_user_id)
    .then(user => {
      if (user) {
        if (user.user_id !== user_id) {
          if (user.user_type !== 'SUPERADMIN') {
            if (approver_permission === 'grant') {
              if (user.approver_permission === true) {
                return Promise.reject({
                  statusCode: 409,
                  success: false,
                  message: "Conflict, Already an approver"
                });
              } else {
                return findUserByUserIdAndUpdateApprover(candidate_user_id, {
                  approver_permission: true
                });
              }
            } else {
              if (user.approver_permission === false) {
                return Promise.reject({
                  statusCode: 409,
                  message: "Conflict,already a user"
                });
              } else {
                return findUserByUserIdAndUpdateApprover(candidate_user_id, {
                  approver_permission: false
                });
              }
            }
          } else
            return Promise.reject({
              statusCode: 400,
              success: false,
              message: 'Bad request, Cannot make SUPERADMIN an approver'
            });
        } {
          return Promise.reject({
            statusCode: 400,
            success: false,
            message: 'Bad request, cannot make yourself as approver'
          });
        }
      } else {
        return Promise.reject({
          statusCode: 400,
          success: false,
          message: `Bad request, No such user exsits with user_id ${user_id}`
        });
      }
    })
    .then(updatedUser => {
      if (updatedUser) {
        return Promise.resolve({
          statusCode: 200,
          message: "Permission changed successfully"
        });
      } else {
        return Promise.reject({
          statusCode: 500,
          message: "Internal Server error"
        });
      }
    });
};



const grantAccess = (user_id, permission) => {
  return findUserByUserId(user_id)
    .then(user => {
      if (user) {
        if (permission === 1) {      // 1 - grant
          if (user.user_type === 'ADMIN') {
            //reject
            return Promise.reject({
              statusCode: 409,
              message: "Conflict, Already an Admin"
            });
          } else {
            //resolve
            return findUserByUserIdAndUpdate(user_id, 'ADMIN');
          }
        } else {
          if (user.user_type === 'USER') {
            //reject
            return Promise.reject({
              statusCode: 409,
              message: "Conflict, Already a User"
            });
          } else {
            //resolve
            return findUserByUserIdAndUpdate(user_id, 'USER');
          }
        }
      }
    })
    .then(updatedUser => {
      if (updatedUser) {
        return Promise.resolve({
          statusCode: 200,
          message: "Permission changed successfully"
        });
      } else {
        return Promise.resolve({
          statusCode: 500,
          message: "Internal Server error"
        });
      }
    });
};

const findByUserId = (user_id) => {
  return findUserByUserId(user_id)
    .then(user => {
      if (user) {
        return Promise.resolve({
          statusCode: 200,
          message: "User Found",
          data: user
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

const validateApprover = (user_id) => {
  return findUserByUserId(user_id)
    .then(user => {
      if (user) {
        if (user.approver_permission) {
          return Promise.resolve({
            statusCode: 200,
            success: true,
            message: "User is an approver"
          });
        } else {
          return Promise.reject({
            statusCode: 401,
            success: false,
            message: "Not an approver"
          });
        }
      } else {
        return Promise.reject({
          statusCode: 404,
          success: false,
          message: `No such user ${user_id} exists`
        });
      }
    });
};

module.exports = {
  createNewUser,
  userLogin,
  grantAccess,
  findByUserId,
  getUsers,
  grantApprover,
  validateApprover
};
