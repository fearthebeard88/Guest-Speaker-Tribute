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
=======
    const documentation = {
        areas: {
            profile: {
                routes: [
                    {
                        url: "/api/profile",
                        method: "GET",
                        parameters: "none",
                        description: "Get all profiles."
                    },
                    {
                        url: "/api/profile/:profile_id",
                        method: "GET",
                        parameters: "profile_id",
                        description: "Get profile by the passed in profile id."
                    },
                    {
                        url: "/api/profile",
                        method: "POST",
                        parameters: "none",
                        description: "Create a profile"
                    },
                    {
                        url: "/api/profile/experience/:profile_id",
                        method: "POST",
                        parameters: "profile_id",
                        description:
                            "Create an experience object for the profile with the passed in profile id."
                    },
                    {
                        url:
                            "/api/profile/experience/:profile_id/:experience_id",
                        method: "DELETE",
                        parameters: "profile_id, experience_id",
                        description:
                            "Delete the experience object with the passed in experience id from the profile with the passed in profile id."
                    },
                    {
                        url: "/api/profile/:profile_id",
                        method: "DELETE",
                        parameters: "profile_id",
                        description:
                            "Delete the profile with passed in profile id."
                    },
                    {
                        url: "/api/profile/:profile_id",
                        method: "PUT",
                        parameters: "profile_id",
                        description:
                            "Update the profile with the passed in profile id."
                    },
                    {
                        url: "/api/profile/:profile_id/:experience_id",
                        method: "PUT",
                        parameters: "profile_id, experience_id",
                        description:
                            "Update the experience object with the passed in experience id of the profile with the passed in profile id."
                    }
                ]
            }
        }
    };
    return res.status(200).json({
        msg: documentation
    });
});

app.use("/api/profile", require("./routes/api/profile.js"));

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
