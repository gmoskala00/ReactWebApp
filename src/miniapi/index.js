const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const USERS = [
    { id: 1, login: "admin", password: "admin123", firstName: "Adam", lastName: "Admin", role: "admin" },
    { id: 2, login: "dev", password: "dev123", firstName: "Darek", lastName: "Dev", role: "developer" },
    { id: 3, login: "ops", password: "ops123", firstName: "Ola", lastName: "Ops", role: "devops" }
];

const JWT_SECRET = 'tajnehaslo';
const REFRESH_SECRET = 'tajnyrefresh';
const TOKEN_EXPIRES = '5m';
const REFRESH_EXPIRES = '7d';

const app = express();
app.use(cors());
app.use(bodyParser.json());

function generateTokens(user) {
    const payload = { id: user.id, login: user.login, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
    return { token, refreshToken };
}

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    const user = USERS.find(u => u.login === login && u.password === password);
    if (!user) return res.status(401).json({ error: "Zły login lub hasło" });
    const { token, refreshToken } = generateTokens(user);
    res.json({ token, refreshToken });
});

app.post('/api/refresh', (req, res) => {
    const { refreshToken } = req.body;
    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = USERS.find(u => u.id === payload.id);
        if (!user) throw new Error('User not found');
        const newTokens = generateTokens(user);
        res.json(newTokens);
    } catch (err) {
        return res.status(401).json({ error: "Nieprawidłowy refresh token" });
    }
});

app.get('/api/me', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Brak tokenu" });
    try {
        const token = auth.replace('Bearer ', '');
        const payload = jwt.verify(token, JWT_SECRET);
        const user = USERS.find(u => u.id === payload.id);
        if (!user) throw new Error('User not found');
        const { password, ...userData } = user;
        res.json(userData);
    } catch (err) {
        res.status(401).json({ error: "Token nieważny lub nieprawidłowy" });
    }
});

app.get('/api/users', (req, res) => {
    const users = getUsers().map(({ password, ...u }) => u);
    res.json(users);
});


app.listen(4000, () => console.log('API listening on http://localhost:4000'));
