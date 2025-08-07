import { Error_handler_class } from "../../../../nettune/src/utils/index.js";
import { user } from "../../../Database/models/index.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
// sign up api
export const sign_up = async (req, res, next) => {
  const { username, email, password } = req.body;
  const is_email_exists = await user.findOne({ email });
  if (is_email_exists) {
    return next(
      new Error_handler_class("email is already exists", 400, "sign up api")
    );
  }
  const hashed_password = hashSync(password, +process.env.SALT_ROUNDS);
  const new_user = new user({ username, email, password: hashed_password });
  await new_user.save();
  res
    .status(201)
    .json({ message: "user created successfully", user_id: new_user._id });
};
// log in api
export const log_in = async (req, res, next) => {
  const { email, password } = req.body;
  const is_user_exists = await user.findOne({ email });
  if (!is_user_exists) {
    return next(
      new Error_handler_class("invalid credentials", 400, "login api")
    );
  }
  const pass_check = compareSync(password, is_user_exists.password);
  if (!pass_check) {
    return next(
      new Error_handler_class("invalid credentials", 400, "login api")
    );
  }
  const token = jwt.sign(
    { user_id: is_user_exists._id },
    process.env.SIGNATURE,
    {
      expiresIn: "30d",
    }
  );
  res
    .status(200)
    .json({ message: "user logged in successfully", token: token });
};
// get profile api
export const list_profile = async (req, res, next) => {
  const { _id } = req.authUser;
  const find_user = await user.findById(_id).select("-password");
  if (!find_user) {
    next(new Error_handler_class("user not found", 404, "list profile api"));
  }
  res.status(200).json(find_user);
};
