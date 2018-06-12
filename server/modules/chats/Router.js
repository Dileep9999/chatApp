import passport from "passport";
import { isValidString } from "../../utils/utils";
import {getchats} from "./Handler";


const jwtAuthenticate = passport.authenticate("jwt", { session: false });

export default router => {
  router.get('/chats',jwtAuthenticate,(req,res)=>{
  let chatlist=req.body.chatlist;
  getchats(chatlist).then(r=>{
      return res.sendStatus(200).json({
       message:"User Chats",  
       success:true,
       data:r
      });
  }).catch(err=>{
    return res.status(err.statusCode || 500).json({
        message:"Chats are not availble",  
        success:false,
       });
  });


  });
    
  };
  