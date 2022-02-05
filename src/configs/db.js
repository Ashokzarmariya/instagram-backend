require("dotenv").config();
const mongoose = require("mongoose")

const dataBase = process.env.MONGODB_ATLAST;

const connect = () => {
    return mongoose.connect("mongodb+srv://ashokzarmariya:Devyani90233@cluster0.uperr.mongodb.net/instagramData?retryWrites=true&w=majority");
}

module.exports = connect; 

//mongodb://127.0.0.1:27017/social_media
//


  