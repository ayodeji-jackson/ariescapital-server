import { ROLES } from "../constants";
import { Schema, model, Types } from "mongoose";
import { User } from "../schema/user.schema";

const UserSchema = new Schema<User>({
  firstName: {
    type: String, 
    required: true, 
    trim: true, 
  }, 
  lastName: {
    type: String, 
    required: true, 
    trim: true, 
  }, 
  email: {
    type: String, 
    requred: true, 
    unique: true, 
  }, 
  phone: {
    type: String, 
    required: true,
  }, 
  referrer: {
    type: String, 
    required: false, 
    trim: true, 
  }, 
  country: {
    type: String, 
    required: true, 
    trim: true, 
  }, 
  password: {
    type: String, 
    required: true, 
  }, 
  role: {
    type: String, 
    enum: ROLES, 
    default: "user"
  }
}, { timestamps: true });
const UserModel = model<User>('user', UserSchema);

export default UserModel;