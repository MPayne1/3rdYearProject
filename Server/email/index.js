// handle all emailing needs

var nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
if (dotenv.error) {
  console.log(dotenv.error)
}

var mailOptions = {};

var transporter = nodemailer.createTransport({
  sevice: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});


function setMailOptions(to) {
  mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: 'test email'
    text: 'It worked!'
  };
}


function sendEmail(to, (err, info) => {
  setMailOptions(to);
  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log(err);
    }  else {
      console.log('email sent' + info.response);
    }
  });
});

module.exports = sendEmail;
