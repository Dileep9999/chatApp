import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    chat_name:String,
    chats=[{
            sender:String,

            message:String,
            
            date_time:Date          
         }],


deleted:[{
          user:String,

          deleted:boolean
         }],


last_Modified:Date
   
  },
  {
    collection: "Chats"
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
  findUserByUserIdAndUpdateApprover
};