const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const PORT = process.env.PORT || 3000;

connectDB();

// Init middleware
// body-parser is now built in to express instead of having to install it separately
app.use(express.json({extended: false}));

app.get("/", (req, res) => {
    return res
        .status(200)
        .json({
            msg:
                "Usage details will follow when I have a chance to write them all out. :-)"
        });
});

app.use("/api/profile", require("./routes/api/profile.js"));

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
