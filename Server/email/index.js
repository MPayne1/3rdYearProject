// handle all emailing needs
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
if (dotenv.error) {
  console.log(dotenv.error)
}
const sendAddress = process.env.EMAIL_ADDRESS;
const sendPassword = process.env.EMAIL_PASSWORD;


var mailOptions = {};

// setup the from email account for sending emails
var transporter = nodemailer.createTransport(smtpTransport({
  sevice: 'Gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: sendAddress,
    pass: sendPassword
  },
  tls: {
    rejectUnauthorized: false
 }
}));

// function to setup the email options, to, subject and content
function setMailOptions(to, subject, text) {
  mailOptions = {
    from: sendAddress,
    to: to,
    subject: subject,
    text: text
  };
}

// function to send the email
function sendEmail(reciever, subject, text, callback) {
  setMailOptions(reciever, subject, text);
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log(err);
      callback(err, null);
    }  else {
      console.log('email sent' + info.response);
      callback(null, info);
    }
  });
}

module.exports = {sendEmail};
