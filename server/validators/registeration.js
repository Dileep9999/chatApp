import Joi from "joi";
import { checkParams } from "../utils/utils";
import _ from "lodash";

module.exports = (req, res, next) => {
  const required_fields = ["user_id", "email", "password"];
  const param_fields = _.pick(req.body, required_fields);

  const validation_result = checkParams(param_fields, required_fields);

  if (validation_result.success) {
    const user_id = req.body.user_id;
    const email = req.body.email;
    const password = req.body.password;

    const schema = Joi.object().keys({
      user_id: Joi.string()
        .alphanum()
        .min(6)
        .max(30)
        .required(),
      password: Joi.string()
        .min(8)
        .regex(/^[a-zA-Z0-9]{8,30}$/)
        .required(),
      email: Joi.string()
        .email()
        .required()
    });

    const result = Joi.validate(
      { user_id: user_id, password: password, email: email },
      schema
    );

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error.ValidationError
      });
    } else {
      req.user_id = user_id;
      req.email = email;
      req.password = password;
      next();
    }
  } else {
    return res.status(400).json({
      success: false,
      message: `Bad request, missing field ${
        validation_result.value
        } in the body`
    });
  }
};
