const express = require('express');
const router = express.Router();
const { createUser } = require('../utils/auth/createUser');
const { authenticateUser } = require('../utils/auth/authenticateUser');
const sendResetMail = require('../utils/auth/sendResetMail');
const User = require('../models/userModel');
const { compareHash } = require('../utils/auth/compareHash');
const { hashData } = require('../utils/auth/hashPass');


// login to existing account route
router.post('/login' , async(req , res) => {
    try {
        let {username , password } = req.body;
        username = username.trim();
        password = password.trim();

        // throws error if any field is empty
        if(!(username&& password)){
            throw Error("ERR_EMPTY_FIELD");
        }

        const authenticatedUser = await authenticateUser({username , password});

        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).json(error.message);    
    }
});

// register new account route
router.post('/signup' , async (req , res) => {
    try{
        let {username , email , password} = req.body;
        username = username.trim();
        email = email.trim();
        password = password.trim();

        const existingEmail = await User.findOne({email});
        const existingUser = await User.findOne({username});


        // throws error if any field is empty
        if(!(username && email && password)){
            throw Error("ERR_EMPTY_FIELDS");
        } 

        // throws error if email is already registerd
        else if(existingEmail){
            throw Error("EMAIL_ALREADY_REGISTERED");
        }

        // throws error if the length of password is less than 8
        else if (password.length < 8){
            throw Error("ERR_SHORT_PASSWORD"); 
        } 

        // validates mail address provided with regex and sends error otherwise
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            throw Error("ERR_INVALID_EMAIL");
        } 

        // throws error if username is already taken
        else if(existingUser){
            throw Error("USERNAME_TAKEN");
        }

        // if the credentials are good then create a new user
        else {
           const newUser = await createUser({
            username,
            email,
            password
           })
           res.status(200).json(newUser);
        }
    } catch(err){
        res.status(400).json(err.message)
    }
});


// when the user forgets the password, an otp is sent to the mail
router.post('/forgot-password' , async(req , res) => {
    try {
        let {email} = req.body;
        if(!email) throw Error("ERR_EMPTY_FIELDS");

        const result = await sendResetMail(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// when the user is signed in and wants to change the password
router.post('/reset-password' , async (req , res) => {
    try {
        let {email , oldPassword , newPassword} = req.body;
        if(!(email && oldPassword && newPassword)) {
            throw Error("ERR_EMPTY_FIELDS")
        };

        // checking if the user exists with the provided email address
        const existingUser = await User.findOne({email});
        if(!existingUser){
            throw Error("USER_NOT_FOUND");
        };

        // checking if the old password provided is correct
        const isPasswordValid = await compareHash(oldPassword , existingUser.password);
        if(!isPasswordValid){
            throw Error("INCORRECT_PASSWORD");
        };

        // reset the password
        const hashedNewPassword = await hashData(newPassword);
        const updatedUser = await User.findOneAndUpdate({
            email : email
        },{
            password : hashedNewPassword
        });
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json(error.message)
    }
});

module.exports = router;