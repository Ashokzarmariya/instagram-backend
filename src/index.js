const express = require("express");
const app = express();

app.use(express.json());

const { register, login } = require("./controllers/auth");
app.post("/register", register);
app.post("/login", login);

const userController = require("./controllers/user.controller");
const postController = require("./controllers/post.controller");
const storyController = require("./controllers/story.controller");
const notificationController = require("./controllers/notification.controller");


app.use("/users", userController);
app.use("/post", postController);
app.use("/story", storyController);
app.use("/notifications", notificationController);


module.exports = app;