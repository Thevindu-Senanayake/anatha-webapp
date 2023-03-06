import nodemailer from "nodemailer";

const sendEmail = async (
  email: string,
  type: "confirmation" | "passReset",
  resetUrl?: string,
  otp?: string
): Promise<boolean> => {
  try {
    const user = process.env.SMTP_USERNAME;
    const password = process.env.SMTP_PASSWORD;

    const transporter = nodemailer.createTransport({
      // host: "smtp.example.com",
      // port: 465,
      // secure: true,
      service: "gmail",
      auth: {
        user: user,
        pass: password,
      },
    });

    if (!otp && !resetUrl) {
      return false;
    }

    let mailOptions = {};

    if (type === "confirmation") {
      mailOptions = {
        from: '"Anatha-Web-App@Alpha" <noreply@myapp.com>',
        to: email,
        subject: "Confirm Your Registration",
        text: `Your one-time password for registration is: ${otp}`,
        html: `<p>Your one-time password for registration is:</p><p style="font-size: 24px; font-weight: bold;">${otp}</p>`,
      };
    } else {
      mailOptions = {
        from: '"Anatha-Web-App@Alpha" <noreply@myapp.com>',
        to: email,
        subject: "Reset Your Password",
        text: `Please click on the following link to reset your password: ${resetUrl}`,
        html: `<p>Please click on the following link to reset your password:</p><a href="${resetUrl}" style="font-size: 24px; font-weight: bold;">Reset Password</a>`,
      };
    }

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};

export default sendEmail;
