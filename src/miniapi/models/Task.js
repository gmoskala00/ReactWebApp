const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    priority: String,
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
    estimateHours: Number,
    state: String,
    createdAt: { type: Date, default: Date.now },
    startDate: Date,
    endDate: Date,
    assigneeId: Number,
    actualHours: Number,
});
module.exports = mongoose.model("Task", TaskSchema);