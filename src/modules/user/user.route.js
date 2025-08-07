import { Router } from "express";
import { error_handle } from "../../middlewares/index.js";
import * as user_controller from "../user/user.controller.js";
import { auth } from "../../middlewares/auth_middleware.js";

const user_router = Router();

user_router.post("/sign_up", error_handle(user_controller.sign_up));
user_router.post("/log_in", error_handle(user_controller.log_in));
user_router.get("/get_profile",auth(),error_handle(user_controller.list_profile))

export { user_router };
