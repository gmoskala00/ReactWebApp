const mongoose = require("mongoose");
const StorySchema = new mongoose.Schema({
    name: String,
    description: String,
    priority: String,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    createdAt: { type: Date, default: Date.now },
    state: String,
    ownerId: String,
});
module.exports = mongoose.model("Story", StorySchema);