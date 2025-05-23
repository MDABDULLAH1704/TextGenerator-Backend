const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ GPT-4.1 Client Configuration
const client = new OpenAI({
    baseURL: 'https://models.github.ai/inference',
    apiKey: process.env.GITHUB_TOKEN, // Make sure this is in your .env file
});

// ✅ Chat endpoint using GPT
app.post('/api/chat', async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.status(400).json({ reply: "Message is required." });
    }

    try {
        const response = await client.chat.completions.create({
            model: 'openai/gpt-4.1',
            temperature: 1,
            top_p: 1,
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant. 
Always respond in valid HTML format.
Use:
- <h1> for the main heading
- <h2> for subheadings
- <p> for paragraphs (2-5 as needed based on the topic)

Avoid Markdown. Return only HTML.`
                },
                { role: "user", content: message }
            ],
        });

        const reply = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        res.json({ reply });

    } catch (error) {
        console.error('GPT error:', error);
        res.status(500).json({ reply: 'Something went wrong while contacting GPT.' });
    }
});

// ✅ Health check endpoint
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

app.listen(PORT, () => {
    console.log(`✅ Server running at port ${PORT}`);
});