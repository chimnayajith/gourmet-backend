const User = require("../../models/userModel");
const { hashData} = require('../auth/hashPass');

const createUser = async (data) => {
    try {
        let {username , email , password } = data;
        
        // checking if user exists with the email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new Error("An account already exists with this email!");
            } else {
                throw new Error("An account already exists with this username!");
            }
        }


        // hashing the password with bcrypt
        const hashedPassword = await hashData(password);

        // creating a new user
        const newUser = new User({
            username : username,
            email : email,
            password : hashedPassword
        });

        // save the created user
        const createdUser = newUser.save();
        return createdUser;
    } catch (error) {
        throw error;
    }
};

module.exports = {createUser}