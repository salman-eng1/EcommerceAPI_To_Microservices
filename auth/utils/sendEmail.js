//nodemailer
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(".env");

const sendEmail = async (options) => {
  //1) create trasporter | service will send email like "gmail, mailgun, mialtrap, sendGrid"
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2) Define email options like (from, to, subject, email content)
  const mailOpts = {
    from: "E-shop App <noreply@zeour.co.uk>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
