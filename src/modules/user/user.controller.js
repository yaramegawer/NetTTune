import { user } from "../../../Database/models/index.js";
import { hashSync } from "bcrypt";
export const sign_up = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const is_email_exists = await user.findOne(email);
  const hashed_password = hashSync(password, process.env.SALT_ROUNDS);
};
