import joi from "joi";

const signup_val = joi
  .object({
    username: joi.string().min(2).max(25).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
      .message(
        "The password must be at least 8 characters and contain one lowercase , one uppercase and one special case"
      )
      .required(),
    confirm_password: joi.string().valid(joi.ref("password")).required(),
    role: joi.string().min(2).max(25),
  })
  .required();

const signin_val = joi
  .object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .min(1)
      .message("The password cannot be empty")
      .required(),
  })
  .required();

const update_profile_val = joi.object({
  username: joi.string().min(2).max(25),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
    .message(
      "The password must be at least 8 characters and contain one lowercase , one uppercase and one special case"
    ),
});

export { signup_val, signin_val, update_profile_val };
