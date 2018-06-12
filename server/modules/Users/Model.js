import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    first_name: {
      type: String,
      // required: true
    },
   
    last_name: {
      type: String,
      //required: true
    },
    full_name: {
      type: String,
      //required: true
    },
    mobile_number: {
      type: String,
      //required: true
    },
    password: {
      type: String,
      required: true
    },
    img:{
      data:Buffer,
      contentType: String
    },
    createdAt: {
      type: Date
    },


    Friends:{
      type:[]
    },

    PendingRequests:{
      type:[]
    },
    
    Groups:{
      type:[]
    }
   
  },
  {
    collection: "Users"
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  user.createdAt = new Date();
  if (!user.user_type) {
    user.user_type = 'USER';
  }
  bcrypt.genSalt(10, function (error, salt) {
    if (error) throw error;
    bcrypt.hash(user.password, salt, function (err, hashPassword) {
      if (err) throw err;
      else {
        user.password = hashPassword;
        return next(user);
      }
    });
  });
});

const userModel = mongoose.model("Users", userSchema);

const comparePassword = (candidatePassword, hashPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hashPassword, (err, isMatch) => {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
};

const saveUser = user => user.save();

const findUserByEmail = email => userModel.findOne({ email });

const findUserByEmailCB = (email, cb) => {
  userModel.findOne({ email }, cb);
};

const findUserByUserIdAndUpdate = (user_id, user_type) => userModel.findOneAndUpdate({ user_id }, { user_type: user_type }, { new: true });
const findUserById = (id, cb) => userModel.findById(id, cb);

const findUserByUserId = user_id => userModel.findOne({ user_id });
const UpdateFriends=(user_id,createdAt)=>userModel.findOneAndUpdate({user_id},{"$push":{"Friends":user_id,"createdAt":createdAt}}, { new: true });
const UpdateGroups=(group_id,createdAt)=>userModel.findOneAndUpdate({user_id},{"$push":{"Groups":group_id,"createdAt":createdAt}}, { new: true });

const findUserByUserType = user_type => userModel.find({ user_type });
const findUserByUserIdAndUpdateApprover = (user_id, obj) =>
  userModel.findOneAndUpdate({ user_id }, { $set: obj }, { new: true });



module.exports = {
  userModel,
  comparePassword,
  saveUser,
  findUserByEmail,
  findUserById,
  findUserByEmailCB,
  findUserByUserId,
  findUserByUserIdAndUpdate,
  findUserByUserType,
  findUserByUserIdAndUpdateApprover,
  UpdateFriends,
  UpdateGroups
};
