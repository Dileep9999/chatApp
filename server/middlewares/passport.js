import { Strategy, ExtractJwt } from "passport-jwt";

import { findUserById, userModel } from "../modules/Users/Model";
import { JWT_SECRET } from "../../config/Oauth_config";

const JwtStrategy = Strategy;

module.exports = passport => {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = JWT_SECRET;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      findUserById(jwt_payload._id, (err, user) => {
        if (err) done(err, false);
        else if (user) done(null, user);
        else done(null, false);
      });
    })
  );
};
