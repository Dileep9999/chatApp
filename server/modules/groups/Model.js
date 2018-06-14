import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Joi from "joi";


const GroupSchema=new mongoose.Schema(
    {
     
       admin:{
           type:String
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
      },
      users:{
          type:[]
      }
     
     
      
      
  
    },
    {
      collection: "Groups"
    }
  );

const Group=new mongoose.model("groups",GroupSchema);


  module.exports=Group;