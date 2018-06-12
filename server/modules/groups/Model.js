import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Joi from "joi";


const GroupSchema=new mongoose.Schema(
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
      collection: "Groups"
    }
  );

const Group=new mongoose.model("groups",GroupSchema);


  module.exports=Group;