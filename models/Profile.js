const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    bio: {
        type: String,
        required: true
    },
    photo: {
        type: String
    }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
