const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator/check");
const Profile = require("../../models/Profile.js");

/**
 * @route GET api/profile
 * @description Get profile from id
 */
router.get("/:id", async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({msg: "Profile not found."});
        }

        return res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: "Server Error."});
    }
});

/**
 * @route POST api/profile
 * @description Create profile
 */
router.post(
    "/",
    [
        check("name", "Name is required.")
            .not()
            .isEmpty(),
        check("occupation", "Occupation is required."),
        check("event", "Event is required."),
        check("bio", "Bio is required.")
    ],
    async (req, res) => {
        try {
        } catch (err) {
            console.error(err);
            return res.status(500).json({msg: "Server Error"});
        }
    }
);
module.exports = router;
