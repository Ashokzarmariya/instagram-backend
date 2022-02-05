const connect = require("./configs/db");
const app = require("./index");

const port =process.env.PORT || 3454;
app.listen(port, async () => {
    await connect();
    console.log("listening on port 3454");
})