const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://pledith31:brijesh1715@cluster0.crjzm.mongodb.net/course_selling');

// Define schemas
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Reference to Course model
});

const CourseSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String, required: true },
     price: { type: Number, required: true },
     imagelink : { type: String, required: true }  // Link to the course's photo (optional
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}