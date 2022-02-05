require("dotenv").config();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const newToken = (user) => {
    return jwt.sign({ user: user }, process.env.THE_SECERET_TOKEN);
}
 


const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email }).lean().exec();
        if (user)
            return res.status(400).send({ message: "email is alredy exist" });
        
        const isUsernameTeken = await User.findOne({ username: req.body.username }).lean().exec();
        if (isUsernameTeken)
            return res.status(401).send({message:"This username is alredy taken"})
        
        user = await User.create(req.body);

        const token = newToken(user);
        
        
        res.status(201).send({user,token})
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

const login = async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        if (!user)
            return res.status(400).send({ message: "user is not exist" });
        
        const match = user.comparePassword(req.body.password);
        //checkPassword also work
        //const match = user.checkPassword(req.body.password);

        if (!match)
            return res.status(402).send({ message: "incorrect password or email" })
        
        const token = newToken(user);

        
        user.password = null;
        return res.status(201).send({ user });
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};


  


module.exports = { register, login };
