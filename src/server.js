
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// MongoDB connection (Make sure this is correct!)
mongoose.connect('mongodb+srv://marcelolankiewicz:Myfriends123%21%40%23@sploty.enqvj.mongodb.net/sploty?retryWrites=true&w=majority&appName=sploty', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));


const wordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    category: { type: String, required: true },
    words: { type: [String], required: true }
});

const Word = mongoose.model('Word', wordSchema);


app.get('/words', async (req, res) => {
    try {
        const wordsByDate = await Word.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    category: { $first: "$category" },
                    words: { $push: "$words" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    category: 1,
                    words: 1
                }
            }
        ])
        res.json(wordsByDate);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ error: 'Failed to fetch words' });
    }
});


app.get('/words/:date', async (req, res) => {
    try {
        const dateString = req.params.date;
        const date = new Date(dateString);
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const wordsForDate = await Word.findOne({ 
            date: { $gte: startDate, $lte: endDate } 
        });

        if (!wordsForDate) {
            return res.status(404).json({ message: 'No words found for this date.' });
        }

        res.json(wordsForDate);

    } catch (error) {
        console.error("Error fetching words by date:", error);
        res.status(500).json({ error: "Failed to fetch words for date" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});