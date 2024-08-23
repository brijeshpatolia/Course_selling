const express = require("express");
const router = express.Router();  // Create a new router instance
const { Admin, Course } = require("../db");
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const jwtPassword = "secret";

router.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await Admin.findOne({ username: username });
    if (existingUser) {
        return res.status(400).json({
            message: "Username already exists",
        });
    }

    await Admin.create({
        username: username,
        password: password,
    });
    res.json({
        message: "Admin created successfully",
    });
});

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const admin = await Admin.findOne({ username: username, password: password });

    if (admin) {
        const token = jwt.sign({ username: username }, jwtPassword);
        res.json({
            token: token,
        });
    } else {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }
});

router.post("/courses", adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const imagelink = req.body.imagelink;
    const price = req.body.price;

    const newCourse = await new Course({
        title: title,
        description: description,
        imagelink: imagelink,
        price: price,
    });
    await newCourse.save();
    res.json({
        message: "Course created successfully",
        courseId: newCourse._id,
    });
});

router.get("/courses", adminMiddleware, async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
});

module.exports = router;
