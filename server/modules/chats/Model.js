import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Joi from "joi";

const MessageSchema=new mongoose.Schema(
  {
    message:{
      type:String
    },
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
     created: {
      type: Date,
      required: true
    },
    from: {
      type: String,
      // required: true
    },
    text: {
      type: String,
      // required: true
    },
    conversationId: {
      type: String,
      // required: true
    },
    
    

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



module.exports={
  saveChat,
  findChatById,
  Message,
  UpdateChat
};