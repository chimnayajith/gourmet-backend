const express = require('express');
const { sendOtp } = require('../utils/otp/sendOtp');
const verifyOtp = require('../utils/otp/verifyOtp');
const User = require('../models/userModel');
const router = express.Router();

router.post("/"  , async(req , res) => {
    try {
        const {email , subject , message , duration} = req.body;

        const createdOtp = await sendOtp({
            email,
            subject,
            message,
            duration
        });
        res.status(200).json(createdOtp);
    } catch (error) {
        res.status(400).json(error.message)
    }
});

router.post("/verify" , async(req , res) => {
    try {
        const {email , otp} = req.body;

        const isValidOTP = await verifyOtp(email , otp);
        if(isValidOTP){
            await User.findOneAndUpdate({email} , {isVerified:true});
        }
        res.status(200).json({valid : isValidOTP});
    } catch (error) {
        res.status(400).json(error.message);
    }
});

module.exports = router;