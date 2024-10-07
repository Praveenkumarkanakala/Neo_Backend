const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`);
});

// Replace <db_password> with your actual MongoDB password and <dbname> with your actual database name
const dbURI = "mongodb://54.197.66.203:27017/neo";

mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDB Atlas successfully"))
    .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));

const web = require('./web');

app.post('/add-data', async (req, res) => {
    const information = new web(req.body);
    try {
        await information.save();
        res.status(201).json({
            status: 'Success',
            data: {
                information
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.get('/get-data', async (req, res) => {
    try {
        const information = await web.find({});
        res.status(200).json({
            status: 'Success',
            data: {
                information
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});
