import passport from "passport";
import { isValidString } from "../../utils/utils";

const jwtAuthenticate = passport.authenticate("jwt", { session: false });

export default router => {
  router.get('/chats',jwtAuthenticate,(req,res)=>{

  });
    
  };
  