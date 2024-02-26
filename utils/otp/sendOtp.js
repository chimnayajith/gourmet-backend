const OTP = require("../../models/otpModel");
const User = require("../../models/userModel");
const generateOtp = require("../otp/generateOtp");
const sendEmail = require("./sendEmail");
const {EMAIL_ADDRESS} = process.env;
const { hashData} = require('../auth/hashPass');

const   sendOtp = async ({email , subject , message , duration = 0.25}) => {
    try {
        // throws error in case of empty fields
        if(!(email && subject && message)){
            throw Error("Provide values for email,subject and messasge")
        };

        // checking if a user exists with the given email address
        if(!await User.findOne({email})){
            throw Error("Account with the given email address does not exist.")
        };
        // clears any existing record
        await OTP.deleteOne({email});
        
        // generate a 4-digit otp
        const generatedOtp = await generateOtp();

        // mail options
        const mailOptions = {
            from : EMAIL_ADDRESS,
            to:email,
            subject,
            html:`<p>${message}</p>
            
            <p style="color:red;font-size:30;letter-spacing:2px">
                <b>
                    ${generatedOtp}
                <b/>
            <p/>
            
            <p>
                This code <b>expires in 15 minutes!<b/>.
            <p/>`,
        }
        await sendEmail(mailOptions);

        // saving the sent otp to mongo
        const hashedOtp = await hashData(generatedOtp);
        const newOtp = await new OTP({
            email,
            otp:hashedOtp,
            createdAt : Date.now(),
            expiresAt : Date.now() + 3600000*duration
        });
        const createdRecord = await newOtp.save();
        return createdRecord;
    } catch (error) {
        throw error;
    }
};

module.exports = {sendOtp};


