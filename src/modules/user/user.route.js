import { Router } from "express";
import { error_handle } from "../../middlewares/index.js";
import * as user_controller from "../user/user.controller.js";
import { auth } from "../../middlewares/auth_middleware.js";
import { validation } from "../../middlewares/validation_middleware.js";
import { signup_val, signin_val, update_profile_val } from "./user.schema.js";

const user_router = Router();

user_router.post(
  "/sign_up",
  validation(signup_val),
  error_handle(user_controller.sign_up)
);
user_router.post(
  "/log_in",
  validation(signin_val),
  error_handle(user_controller.log_in)
);
user_router.get(
  "/get_profile",
  auth(),
  error_handle(user_controller.list_profile)
);
user_router.put(
  "/update",
  auth(),
  validation(update_profile_val),
  error_handle(user_controller.update_profile)
);

export { user_router };
