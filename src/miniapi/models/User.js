const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    login: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    role: String,
});

module.exports = mongoose.model("User", UserSchema);