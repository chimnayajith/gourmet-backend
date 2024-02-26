const OTP = require("../../models/otpModel");
const { compareHash } = require("../auth/compareHash");

const verifyOtp = async(email , otp) => {
    try {
        // throws error if any of the required fields are empty
        if(!(email && otp)){
            throw Error("Provide values for email and otp")
        };

        const fetchedData = await OTP.findOne({email});


        if(!fetchedData){
            throw Error("OTP Record doesn't exist.")
        };
        
        // checks if the generated otp has expired
        if(fetchedData.expiresAt < Date.now()){
            await OTP.deleteOne({email});
            throw Error("The otp generated has expired.")
        }

        const isValidOtp = await compareHash(otp , fetchedData.otp);
        return isValidOtp;

    } catch (error) {
        throw error;
    }
};

module.exports = verifyOtp;