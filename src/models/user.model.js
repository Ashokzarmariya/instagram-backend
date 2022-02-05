const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: { type: Number, required: false },
        bio: { type: String, required: false },
        profilePic: { type: String, default: "https://www.pngitem.com/pimgs/m/678-6785829_my-account-instagram-profile-icon-hd-png-download.png" },
        notifications: [
            {
                notification: {
                    type: String,
                    required: true,
                    trim: true,
                },
                userPic: {
                    type: String,
                    required: true,
                    trim: true,
                },
                postSrc: {
                    type: String,
                    required: true,
                    trim: true,
                },
                timestamps:{
                    type: String,
                    required: true,
                    trim: true,
                },
            }
        ],
        isNewNotifications: { type: Boolean, default: false },
        tagPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post", required: true }],
        storys: [{ type: mongoose.Schema.Types.ObjectId, ref: "story", required: true }],
        following: [mongoose.Schema.Types.ObjectId],
        followers: [mongoose.Schema.Types.ObjectId],
        savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "post", required: true }],
        
    }, {
        versionKey: false,
        timestamps: true,
        
    }
    
);

userSchema.pre("save", function (next) {
    
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    this.username = this.username.toLowerCase();
    return next();
});


userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}
  


const User = mongoose.model("user", userSchema);
module.exports = User;
