import { Schema, model } from "mongoose";
import validator from "validator";

const OTPSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    validate: [validator.isEmail, "Please enter a valid email address."],
  },
  code: {
    type: String,
    required: [true, "OTP is required"],
    maxLength: [6, "OTP can't be longer than 6 characters"],
  },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
});

export default model("OTP", OTPSchema);
