const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

// MODELE
const Project = require("./models/Project");
const Story = require("./models/Story");
const Task = require("./models/Task");
const User = require("./models/User")

// Połącz z MongoDB Atlas
mongoose.connect(
    "mongodb+srv://admin:admin123@cluster0.wzuhsde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.on("connected", () => {
    console.log("✅ Połączono z MongoDB Atlas!");
});
mongoose.connection.on("error", (err) => {
    console.error("❌ Błąd połączenia z MongoDB:", err);
});

const JWT_SECRET = 'tajnehaslo';
const REFRESH_SECRET = 'tajnyrefresh';
const TOKEN_EXPIRES = '5m';
const REFRESH_EXPIRES = '7d';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- AUTH ENDPOINTY ---
function generateTokens(user) {
    const payload = { id: user.id, login: user.login, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
    return { token, refreshToken };
}

app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;
    const user = await User.findOne({ login, password });
    if (!user) return res.status(401).json({ error: "Zły login lub hasło" });
    const payload = { id: user._id, login: user.login, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
    res.json({ token, refreshToken });
});


app.post('/api/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await User.findById(payload.id);
        if (!user) throw new Error('User not found');
        const newTokens = generateTokens(user);
        res.json(newTokens);
    } catch (err) {
        return res.status(401).json({ error: "Nieprawidłowy refresh token" });
    }
});

app.get('/api/me', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Brak tokenu" });
    try {
        const token = auth.replace('Bearer ', '');
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select("-password");
        if (!user) throw new Error('User not found');
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: "Token nieważny lub nieprawidłowy" });
    }
});


app.get('/api/users', async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});


// --- PROJECT ENDPOINTY ---
app.get('/api/projects', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

app.post('/api/projects', async (req, res) => {
    const proj = await Project.create(req.body);
    res.json(proj);
});

app.delete('/api/projects/:id', async (req, res) => {
    const projectId = req.params.id;
    const stories = await Story.find({ projectId });
    const storyIds = stories.map(s => s._id);
    await Task.deleteMany({ storyId: { $in: storyIds } });
    await Story.deleteMany({ projectId });
    await Project.findByIdAndDelete(projectId);

    res.json({ ok: true });
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!project) return res.status(404).json({ error: "Projekt nie znaleziony" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

// --- STORY ENDPOINTY ---
app.get('/api/stories', async (req, res) => {
    const { projectId } = req.query;
    const query = projectId ? { projectId } : {};
    const stories = await Story.find(query);
    res.json(stories);
});

app.post('/api/stories', async (req, res) => {
    const story = await Story.create(req.body);
    res.json(story);
});

app.delete('/api/stories/:id', async (req, res) => {
    const storyId = req.params.id;
    await Task.deleteMany({ storyId });
    await Story.findByIdAndDelete(storyId);

    res.json({ ok: true });
});

app.put('/api/stories/:id', async (req, res) => {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(story);
});

app.get('/api/stories/:id', async (req, res) => {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: "Not found" });
    res.json(story);
});

// --- TASK ENDPOINTY ---
app.get('/api/tasks', async (req, res) => {
    const { storyId } = req.query;
    const query = storyId ? { storyId } : {};
    const tasks = await Task.find(query);
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});

app.put('/api/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

// --- START SERVERA ---
app.listen(4000, () => console.log('API listening on http://localhost:4000'));
