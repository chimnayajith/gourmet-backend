const nodemailer = require("nodemailer");
const {EMAIL_ADDRESS , EMAIL_PASSWORD} = process.env;


let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });

// verifying the email account
transporter.verify((error , success)=> {
    if(error){
        console.log(error);
    } else {
        console.log("Ready to send emails");
    }
});

const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return;
    } catch (error) {
        throw error;
    }
}

module.exports = sendEmail;