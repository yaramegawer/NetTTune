import { Error_handler_class } from "../utils/index.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let { error } = schema.validate(
      { ...req.body, ...req.params, ...req.query },
      { abortEarly: false }
    );
    if (!error) {
      next();
    } else {
      let err_messages = error.details.map((err) => err.message);
      next(
        new Error_handler_class(
          "validation Error",
          400,
          err_messages,
          "validation middleware"
        )
      );
    }
  };
};
