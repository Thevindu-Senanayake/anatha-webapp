import { NextFunction, Request, Response } from "express";

import User from "../models/User";
import OTP from "../models/OTP";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import sendToken from "../utils/sendToken";
import sendEmail from "../utils/sendEmail";
import generateOTP from "../utils/generateOTP";
import crypto from "crypto";
import cloudinary from "cloudinary";

// options for cookie
const options = {
  expires: new Date(Date.now() + 7 * 1000 * 60 * 60 * 24),
  httpOnly: true,
  secure: true,
};

// Register a user  => /api/v1/register
export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      if (user.verified) {
        return next(
          new ErrorHandler(
            `You Have Already Registered with this Email: ${email}`,
            400
          )
        );
      } else if (!user.verified) {
        res.cookie("registrationCompleted", true, options);
        res.cookie("email", email, options);
        res.cookie("name", name, options);

        return next(
          new ErrorHandler(
            "You Have Already Filled the Registration Form! Verify Your Account",
            400
          )
        );
      }
    }

    const otp = generateOTP();
    const isSent = await sendEmail(
      email,
      process.env.SENDGRID_REGISTER_TEMPLATEID as string,
      { otp, email, name }
    );

    if (!isSent) {
      return next(
        new ErrorHandler("Something went wrong! Fail to send email", 500)
      );
    }

    await OTP.create({ email: email, code: otp });

    await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "",
        url: "",
      },
    });

    res.cookie("registrationCompleted", true, options);
    res.cookie("email", email, options);
    res.cookie("name", name, options);

    res
      .status(200)
      .json({ success: true, message: `Email has sent to ${email}` });

    // sendToken(user, 200, res);
  }
);

export const verifyRegistration = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    const { email } = req.cookies;

    if (!code) {
      return next(new ErrorHandler("Code is required", 400));
    }

    if (!email) {
      return next(
        new ErrorHandler(
          "Can't retrieve email from cookies! Try Filling Registration Form Again!",
          500
        )
      );
    }

    const otp = await OTP.findOne({ email: email });

    if (!otp) {
      return next(new ErrorHandler("Otp Expired", 404));
    }

    if (otp.code !== code) {
      return next(new ErrorHandler("Invalid Code", 400));
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new ErrorHandler(`User not found with Email ${email}`, 404));
    }

    user.verified = true;

    await user.save();
    await OTP.findByIdAndDelete(otp._id);

    res.clearCookie("email", { path: "/" });
    res.clearCookie("name", { path: "/" });
    res.clearCookie("registrationCompleted", { path: "/" });

    sendToken(user, 200, res);
  }
);

export const resendOTP = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.cookies;

    if (!email) {
      return next(
        new ErrorHandler(
          "Can't retrieve email from cookies! Try Filling Registration Form Again!",
          500
        )
      );
    }

    // generate otp
    const otp = generateOTP();

    // send confirmation email
    const isSent = await sendEmail(
      email,
      process.env.SENDGRID_REGISTER_TEMPLATEID as string,
      { otp, email, name }
    );

    if (!isSent) {
      return next(new ErrorHandler("Fail Send Confirmation Email", 500));
    }

    // check if otp is already present and if delete the current otp record
    await OTP.findOneAndDelete({ email: email });

    await OTP.create({ code: otp, email: email });

    res.status(200).json({
      success: true,
      message: "A confirmation Email has been sent to your email",
    });
  }
);

// Login User  =>	/api/v1/login
export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    if (!user.verified) {
      return next(
        new ErrorHandler("Verify Your Account Using OTP And try again", 401)
      );
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("your password is incorrect", 401));
    }

    sendToken(user, 200, res);
  }
);

// Reset Password	=> /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // Hash URL token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler("Your password reset token is invalid or expired", 400)
      );
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    sendToken(user, 200, res);
  }
);

// Forgot Password	=> /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    try {
      const isSend = await sendEmail(user.email, "passReset", resetUrl);

      if (!isSend) {
        return next(new ErrorHandler("Fail to send Email", 500));
      }

      res.status(200).json({
        success: true,
        message: `Email has been sent to ${user.email}`,
      });
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get currently logged in user details	=> /api/v1/me
export const getUserDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// Update / Change password	=> /api/v1/password/update
export const updatePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.user._id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if (!isMatched) {
      return next(new ErrorHandler("current password is incorrect", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
  }
);

// Update user Details	=> /api/v1/me/update
export const updateUserDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let newUserData = {
      name: req.body.name,
      email: req.body.email,
      avatar: {
        public_id: req.body.user.avatar.public_id,
        url: req.body.user.avatar.url,
      },
    };

    // Update avatar if there's already a avatar for this user
    if (req.body.user.avatar.url !== "" && req.body.avatar !== "") {
      const user = await User.findById(req.body.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const image_id = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Update avatar for the first time
    if (req.body.user.avatar.url === "" && req.body.avatar !== "") {
      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(req.body.user._id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// Add/Update address of user  => /api/v1/address
export const updateAddress = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      fullName,
      phoneNumber,
      fullAddress,
      postalCode,
      city,
      country,
      tag,
    } = req.body;

    const requiredFields = [
      "fullName",
      "phoneNumber",
      "fullAddress",
      "postalCode",
      "city",
      "country",
      "tag",
    ];

    const isValid = requiredFields.every((field) => {
      return (
        typeof req.body[field] === "string" && req.body[field].trim().length > 0
      );
    });

    if (!isValid) {
      return next(new ErrorHandler("All Fields are required!", 400));
    }

    const user = await User.findByIdAndUpdate(
      req.body.user._id,
      {
        address: {
          fullName,
          phoneNumber,
          fullAddress,
          postalCode,
          city,
          country,
          tag,
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  }
);

// Get User Address  => /api/v1/address
export const getAddress = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const address = req.body.user.address;

    if (!address) {
      return next(new ErrorHandler("You Don't Have Set Any Address", 400));
    }

    res.status(200).json({ success: true, address });
  }
);

// Delete User Address => /api/v1/address
export const deleteAddress = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(
      req.body.user._id,
      { $unset: { address: 1 } },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  }
);

// Logout user  => /api/v1/logout
export const logoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "You have logged out",
    });
  }
);

// Admin Routes
// Get all users	=> /api/v1/admin/users
export const allUsers = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  }
);

// Get specific user Details by id	=> /api/v1/admin/user/:id
export const getSingleUserDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`user does not found with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// Update user Details	=> /api/v1/admin/user/:id/update
export const updateUserDetailsByAdmin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// Delete user	=> /api/v1/admin/user/:id
export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`user does not found with id: ${req.params.id}`, 404)
      );
    }

    // Remove avatar from cloudinary
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    await user.deleteOne();

    res.status(200).json({
      success: true,
    });
  }
);
