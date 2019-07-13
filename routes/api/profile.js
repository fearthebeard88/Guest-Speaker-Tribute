const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const Profile = require("../../models/Profile.js");

/**
 * @route * *
 * @description Place to mount middleware functions for all requests using this router.
 */
router.all("/", (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        console.log(req.method);
        let contentType = req.headers["content-type"];
        if (contentType.toLowerCase() != "application/json") {
            return res.status(415).json({
                error:
                    "Content type is not supported. Please use application/json"
            });
        }
    }
    console.log(req.method);
    next();
});

/**
 * @route GET api/profile
 * @description Get all profiles
 */
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find();
        return res.status(200).json(profiles);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array});
            }

            // All the fields the profile takes, except for experience which will be on a separate route.
            let fields = ["name", "occupation", "event", "bio", "photo"];

            var profile = new Profile({});
            for (let i = 0; i < fields.length; i++) {
                // Loop through the fields to fill in the object properties.
                if (typeof req.body[fields[i]] == "undefined") {
                    continue;
                }

                profile[fields[i]] = req.body[fields[i]].trim();
            }

            await profile.save();
            return res.status(200).json(profile);
        } catch (err) {
            console.error(err);
            return res.status(500).json({msg: "Server Error"});
        }
    }
);

/**
 * @route POST /api/profile/experience/:id
 * @description Add experience object to profile
 */
router.post(
    "/experience/:id",
    [
        check("title", "Title is required.")
            .not()
            .isEmpty(),
        check("company", "Company is required.")
            .not()
            .isEmpty(),
        check("description", "Description is requried.")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        try {
            const profile = await Profile.findById(req.params.id);
            if (!profile) {
                return res
                    .status(404)
                    .json({msg: "Post not found by that ID."});
            }
            console.log(profile);

            const newExperience = {
                title: req.body.title,
                company: req.body.company,
                description: req.body.description
            };

            profile.experience.unshift(newExperience);
            await profile.save();
            return res.status(200).json(profile);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }
);

/**
 * @route DELETE api/profile/experience/:prof_id/:exp_id
 * @description Remove experience from a profile
 */
router.delete("/experience/:prof_id/:exp_id", async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.prof_id);
        if (!profile) {
            return res.status(404).json({msg: "No profile found by that ID."});
        }

        const index = profile.experience.map((exp, i) => {
            if (exp._id === req.params.exp_id) {
                return i;
            }
        });

        profile.experience.splice(index, 1);
        await profile.save();
        return res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

/**
 * @route DELETE api/profile/:id
 * @description Remove a profile by ID
 */
router.delete("/:id", async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({msg: "Profile not found."});
        }

        profile.remove();
        return res.status(200).json({msg: "Profile deleted."});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

/**
 * @route PUT api/profile/:id
 * @description Update profile by ID
 */
router.put(
    "/:id",
    [
        check("name", "Name is required.")
            .not()
            .isEmpty(),
        check("occupation", "Occupation is required.")
            .not()
            .isEmpty(),
        check("event", "Event is required.")
            .not()
            .isEmpty(),
        check("bio", "Bio is required.")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            var profile = await Profile.findById(req.params.id);
            if (!profile) {
                return res.status(404).json({msg: "Profile not found."});
            }

            let fields = ["name", "occupation", "event", "bio", "photo"];

            var profileFields = {};
            for (let i = 0; i < fields.length; i++) {
                if (
                    !req.body.hasOwnProperty(fields[i]) ||
                    req.body[fields[i]].trim() === ""
                ) {
                    continue;
                }

                profileFields[fields[i]] = req.body[fields[i]].trim();
            }

            profile = await Profile.findOneAndUpdate(
                {_id: req.params.id},
                {$set: profileFields},
                {new: true}
            );

            return res.status(200).json(profile);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }
);

/**
 * @route PUT api/profile/experience/:prof_id/:exp_id
 * @description Update an experience object on a profile
 */
router.put(
    "/experience/:prof_id/:exp_id",
    [
        check("title", "Title is required.")
            .not()
            .isEmpty(),
        check("company", "Company is required.")
            .not()
            .isEmpty(),
        check("description", "Description is required.")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }

            const profile = await Profile.findById(req.params.prof_id);
            if (!profile) {
                return res.status(404).json({msg: "Profile not found."});
            }

            const index = profile.experience.map((exp, i) => {
                console.log(typeof exp._id);
                console.log(typeof req.params.exp_id);
                console.log(i);
                if (exp._id == req.params.exp_id) {
                    return i;
                }
            });

            if (
                typeof index == "undefined" ||
                index == null ||
                index[0] == null
            ) {
                return res.status(404).json({msg: "Experience not found."});
            }

            const values = ["title", "company", "description"];
            console.log(index);
            values.map(prop => {
                profile.experience[index][prop] = req.body[prop];
            });

            await profile.save();
            return res.status(200).json(profile);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }
);

module.exports = router;
