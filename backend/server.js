const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ✅ Fix CORS issues
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const payload = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            temperature: 0.7,
            max_tokens: 500
        };

        const headers = {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(OPENROUTER_API_URL, payload, { headers });

        const reply = response.data.choices[0].message.content;
        return res.json({ reply });

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Failed to get response from OpenRouter' });
    }
});

const path = require('path');

// ✅ Fix path for Render deployment
app.use(express.static(path.join(__dirname, './frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend', 'chatbot.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
