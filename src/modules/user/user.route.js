import { Router } from "express";
import { error_handle } from "../../middlewares/index.js";
import * as user_controller from "../user/user.controller.js";

const user_router = Router();

user_router.post("/sign_up", error_handle(user_controller.sign_up));
user_router.post("/log_in", error_handle(user_controller.log_in));

export { user_router };
