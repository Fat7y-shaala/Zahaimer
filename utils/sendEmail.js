const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter (service that will send email like "gmail" , "mailgun " , "mailtrap")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure is false then port is 587 , secure true port is 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // define mail options (like from , to , subject , email content)
  const mailOpts = {
    from: "EL_Zahaimer App <fathykhaled936@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
