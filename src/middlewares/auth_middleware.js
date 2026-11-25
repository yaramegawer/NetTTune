import jwt from "jsonwebtoken";
import { user } from "./../../DB/models/user.model.js";
export const auth = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization || req.headers.token;
      if (!token) {
        return res.status(400).json({
          message: "please sign_in first , there is no token generated",
        });
      }
      const decoded_data = jwt.verify(token, process.env.SIGNATURE);
      if (!decoded_data?.user_id) {
        return res.status(400).json({
          message: "invalid token payload",
        });
      }
      const User = await user
        .findById(decoded_data.user_id)
        .select("-password");
      if (!User) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      req.authUser = User;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "something went wrong",
      });
    }
  };
};
