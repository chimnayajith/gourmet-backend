const bcrypt = require("bcrypt");

const compareHash = async(password , hashedPassword) => {
    try {
        const match =  await bcrypt.compare(password , hashedPassword);
        return match;
    } catch (error) {
        throw Error(error + 'hello');
    }
}

module.exports = {compareHash}