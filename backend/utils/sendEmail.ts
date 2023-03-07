import sendGrid from "@sendgrid/mail";

const sendEmail = async (
  email: string,
  templateId: string,
  data: any
): Promise<boolean> => {
  sendGrid.setApiKey(process.env.SENDGRID_API_KEY as string);

  const msg = {
    to: email,
    subject: "Legendary Store",
    from: process.env.SENDGRID_MAIL as string,
    templateId: templateId,
    dynamic_template_data: data,
  };
  try {
    await sendGrid.send(msg);
    return true;
  } catch (error) {
    return false;
  }
};

export default sendEmail;
