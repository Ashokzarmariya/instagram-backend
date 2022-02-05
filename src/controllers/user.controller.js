const { Router } = require("express");
const Post = require("../models/post.model");
const router = Router();
const User = require("../models/user.model");

router.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limits = req.query.size || 10;

        const skips = (page - 1) * limits;

        const user = await User.find({}, { password: 0, token: 0, mobile: 0, email: 0 })
            .skip(skips)
            .limit(limits);
        
        return res.status(200).send(user);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
    
});


router.get("/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username }, { password: 0, token: 0, mobile: 0, email: 0,notifications:0 }).lean().exec();
            
        
        return res.status(200).send(user);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
    
});


router.patch("/follow/:id", async (req, res) => {
    try {
        //whom wants to follow
        const followerId = req.body.followersUserId;
        // who wants to follow
        const followingId = req.params.id;
        const isfollowingUser = await User.findById(followingId);
        const isfollowerUser = await User.findById(followerId);

        if (!followerId)
            return res.status(400).send({ error: "plese provie a userId whome you want to follow" });
        if (!isfollowingUser)
            return res.status(401).send({ error: "following user is not exist" });
        if (!isfollowerUser)
            return res.status(402).send({ error: "followerUser is not exist" });
        
        const user = await User.findByIdAndUpdate(
            isfollowingUser,
            { $addToSet: { following: followerId } },
            { new: true },
        );

        await User.findByIdAndUpdate(
            followerId,
            { $addToSet: { followers: followingId } },
            { new: true },
            
        );

        await User.findByIdAndUpdate(
            followerId, {
            $addToSet: {
                notifications: {
                    notification: `${isfollowingUser.username} start following you`,
                    userPic: isfollowingUser.profilePic,
                    timestamps: Date.now(),
                }
            }
        },
            { new: true },
            
        );
        await User.findByIdAndUpdate(
            followerId, { isNewNotifications: true },
            { new: true },
            
        );
        return res.status(201).send(
            { message: `you start following ${isfollowerUser.username}`, data: user })
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});

router.patch("/unfollow/:id", async (req, res) => {
    try {
        //whom wants to unfollow
        const followerId = req.body.followersUserId;
        // who wants to unfollow
        const followingId = req.params.id;
        const isfollowingUser = await User.findById(followingId);
        const isfollowerUser = await User.findById(followerId);

        if (!followerId)
            return res.status(400).send({ error: "plese provie a userId whome you want to follow" });
        if (!isfollowingUser)
            return res.status(401).send({ error: "following user is not exist" });
        if (!isfollowerUser)
            return res.status(402).send({ error: "followerUser is not exist" });
        
        const user = await User.findByIdAndUpdate(
            isfollowingUser,
            { $pull: { following: followerId } },
            { new: true },
        );

        await User.findByIdAndUpdate(
            followerId,
            { $pull: { followers: followingId } },
            { new: true },
            
        );

        
        return res.status(201).send(
            { message: `you unfollow ${isfollowerUser.username}`, data: user })
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
});

router.patch("/savepost/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const postId = req.body.postId;

        const isUser = await User.findById(userId).lean().exec();
        const isPost = await Post.findById(postId).lean().exec();

        if (!userId)
            return res.status(400).send({ error: "userId is required" });
        if (!isUser)
            return res.status(401).send({ error: "this user is not exist" });
        if (!isPost)
            return res.status(402).send({ error: "this post is not exist" });
        
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedPost: postId } },
            { new: true },
        );

        return res.status(201).send({ message: "post saved successfully", data: user });
    }
    catch (err) {
        return res.status(500).send(error.message);
    }
});

router.patch("/removesavepost/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const postId = req.body.postId;

        const isUser = await User.findById(userId).lean().exec();
        const isPost = await Post.findById(postId).lean().exec();

        if (!userId)
            return res.status(400).send({ error: "userId is required" });
        if (!isUser)
            return res.status(401).send({ error: "this user is not exist" });
        if (!isPost)
            return res.status(402).send({ error: "this post is not exist" });
        
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { savedPost: postId } },
            { new: true },
        );

        return res.status(201).send({ message: "post removed successfully", data: user });
    }
    catch (err) {
        return res.status(500).send(error.message);
    }
});



router.patch("/update/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();
        res.status(201).send(user);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).lean().exec();
        res.status(201).send(user);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});

module.exports = router;