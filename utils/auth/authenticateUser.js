const {compareHash}=require('./compareHash');
const User = require("../../models/userModel");
const {createToken }= require("../auth/createToken");

const authenticateUser = async ( data ) => {
    try {

        let {username , password} = data;
        const fetchedUser = await User.findOne({
            username:username
        });

        if(!fetchedUser){
            throw Error("Invalid username entered")
        }
        // verifying entered password.
        const isPasswordMatch = await compareHash(password , fetchedUser.password);
        
        if(!isPasswordMatch){
            throw Error("Invalid password for the username")
        } else {
            const tokenData = {userId : fetchedUser._id , username};
            const token = await createToken(tokenData);
            
            fetchedUser.token = token;
            return fetchedUser;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {authenticateUser};