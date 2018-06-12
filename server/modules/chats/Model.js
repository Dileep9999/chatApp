import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Joi from "joi";

const MessageSchema=new mongoose.Schema(
  {
   
     users:{
       type:[]
     },
     conversation_id:{
       type:String,
      //  required:true
     },
     conversation:{
       type:[{
         sender:String,
         message:String,
         CreatedAt:Date
       }]
     },
     createdAt: {
      type: Date,
      required: true
    }
    

  },
  {
    collection: "Chats"
  }
);

const Message = mongoose.model('Message', MessageSchema);


const findChatById=(conversation_id)=>Message.find({conversation_id:conversation_id});




const saveChat = message => message.save();

const UpdateChat=(conversation_id,new_message)=>Message.findOneAndUpdate({conversation_id},
  {"$push":{"conversation":new_message}},{ new: true }
);

const getUserChats=(chats)=>Message.find({conversation_id:{$in:chats}});


module.exports={
  saveChat,
  findChatById,
  Message,
  UpdateChat,
  getUserChats
};