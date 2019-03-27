// handle all emailing needs
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
if (dotenv.error) {
  console.log(dotenv.error)
}
const sendAddress = process.env.EMAIL_ADDRESS;
const sendPassword = process.env.EMAIL_PASSWORD;
const host = "localhost:8080";

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

// function to send the change email email
function sendChangeEmail(reciever,firstname, lastname,callback) {
  var text = `Hello ${firstname} ${lastname},
   You have successfully changed your email address to ${reciever}`;
  var subject = "Change of email address";

  setMailOptions(reciever, subject, text);
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log(err);
      callback(err, null);
    }  else {
      console.log('email sent ' + info.response);
      callback(null, info);
    }
  });
}

// function to send changed password email
function sendChangePassword(reciever, firstname, lastname, callback) {
  var text = `Hello ${firstname} ${lastname},
  You have successfully changed your password`;
  var subject = "Change of password";

  setMailOptions(reciever, subject, text);
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log(err);
      callback(err, null);
    }  else {
      console.log('email sent ' + info.response);
      callback(null, info);
    }
  });
}


// function send forgotten password email
function sendForgottenPassword(email, firstname, lastname, token, callback) {
  var text = `Hello ${firstname} ${lastname},
  You are receiving this because you (or someone else) have requested the reset of the password for your account.
  Please click on the following link, or paste this into your browser to complete the process:
  http://${host}/#/auth/resetPassword/${token}
  If you did not request this, please ignore this email and your password will remain unchanged.`;

  var subject = "Reset Password";
  setMailOptions(email, subject, text);

  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log(err);
      callback(err, null);
    }  else {
      console.log('email sent ' + info.response);
      callback(null, info);
    }
  });
}

// send email with updated fixture info
function sendFixtureUpdated(email, firstname, lastname, homeTeamName, awayTeamName,
  date, address, city, county, postcode, callback) {
    var text = `Hello ${firstname} ${lastname},
    The match between ${homeTeamName} vs ${awayTeamName} has been updated to now take place at:
    ${date}
    ${address}
    ${city}
    ${county}
    ${postcode}`;
    var subject = "Fixtutre Information Updated";
    setMailOptions(email, subject, text);
    transporter.sendMail(mailOptions, (err, info) => {
      if(err) {
        console.log(err);
        callback(err, null);
      }  else {
        console.log('email sent ' + info.response);
        callback(null, info);
      }
    });
}

// send email for a new team annoucement
function sendTeamAnnouncement(email,firstname, lastname, teamname, message) {
  var text = `Hello ${firstname} ${lastname},
  You have recieved a new team message from ${teamname}:
  ${message}`;

  var subject = "New Team Announcement";
  setMailOptions(email, subject, text);
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log(err);
      callback(err, null);
    }  else {
      console.log('email sent ' + info.response);
      callback(null, info);
    }
  });
}



module.exports = {
  sendChangeEmail,
  sendChangePassword,
  sendForgottenPassword,
  sendFixtureUpdated
};
