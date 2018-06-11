import { checkParams } from "../utils/utils";
import _ from 'lodash';

module.exports = (req, res, next) => {
  const required_fields = ["userid_email", "password"];
  const param_fields = _.pick(req.body, required_fields);

  const validation_result = checkParams(param_fields, required_fields);
  if (validation_result.success) {
    const userid_email = req.body.userid_email;
    const password = req.body.password;
    req.userid_email = userid_email;
    req.password = password;
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: `Bad request, missing field in the body`
    });
  }
};
