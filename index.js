const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Creation 
app.get("/", (req, res) => {
    res.send("Express App is Running");
})

// Endpoint to generate text
app.post('/generate-text', (req, res) => {
    const { message, count } = req.body;
    // Validate input
    if (!message || count < 1 || count > 1000000000) {
        return res.status(400).json({ error: 'Invalid message or count' });
    }
    // Generate an array of repeated messages
    const texts = Array.from({ length: count }, () => message);
    // Send the generated texts as a JSON response
    res.json(texts);
});


app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
