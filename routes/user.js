const express = require("express");
const router = express.Router();  // Create a new router instance
const { User, Course } = require("../db");  // Assuming Course model is also imported
const jwt = require("jsonwebtoken");  // Import jwt since it's being used
const adminMiddleware = require("../middleware/admin");  // Assuming you have this middleware
const userMiddleware = require("../middleware/user");  // Assuming you have this middleware
const jwtPassword = "secret";

router.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(409).json({
            msg: "Username already exists"
        });
    } else {
        const newUser = new User({ username, password });
        await newUser.save();
        return res.json({
            msg: "User created successfully"
        });
    }
});

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username: username, password: password });

    if (user) {
        const token = jwt.sign({ username: username }, jwtPassword);
        return res.json({
            token: token
        });
    } else {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }
});
router.post("/courses/:courseId", userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const decoded = jwt.verify(req.header("Authorization").split(" ")[1], jwtPassword);
    const username = decoded.username;
    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        message: "Purchase complete!"
    })
});
router.get("/courses", adminMiddleware, async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
    const decoded = jwt.verify(req.header("Authorization").split(" ")[1], jwtPassword);
    const username = decoded.username;
    const user = await User.findOne({ username});
    const purchasedCourses = user.purchasedCourses;

    const courses = await Course.find({ _id: { $in: purchasedCourses } });

    res.json({
        purchasedCourses: courses
    });
});

module.exports = router;
