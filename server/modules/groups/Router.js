import passport from "passport";
import { isValidString } from "../../utils/utils";
import { createNewUser, userLogin, grantAccess, getUsers, grantApprover } from "./Handler";

import SignupValidator from "../../validators/registeration";
import SigninValidator from "../../validators/login";
import AdminValidator from "../../validators/AdminValidator";
import ApproverValidator from "../../validators/ApproverValidator";
import IsSuperAdmin from "../../middlewares/IsSuperAmin";
import isAdmin from "../../middlewares/isAdmin";

const jwtAuthenticate = passport.authenticate("jwt", { session: false });

export default router => {
  router.post("/signup", SignupValidator, function (req, res) {
    const user_id = req.user_id;
    const email = req.email;
    const password = req.password;
    createNewUser(user_id, email, password)
      .then(result => {
        return res.status(result.statusCode).json({
          success: true,
          message: result.message
        });
      })
      .catch(err => {
        return res.status(err.statusCode || 500).json({
          success: false,
          message: err.message
        });
      });
  });

  router.post("/signin", SigninValidator, (req, res) => {
    const userid_email = req.userid_email;
    const password = req.password;
    if (isValidString(userid_email) && isValidString(password)) {
      userLogin(userid_email, password)
        .then(result => {
          return res.status(200).json({
            success: true,
            token: result.token,
            user: {
              email: result.user.email,
              user_id: result.user.user_id,
              user_type: result.user.user_type
            }
          });
        })
        .catch(err => {
          return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
          });
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "Missing email or password"
      });
    }
  });

  router.get("/profile", jwtAuthenticate, (req, res) => {
    return res.json({
      user_id: req.user.user_id,
      email: req.user.email,
      user_type: req.user.userType
    });
  });


  
};
