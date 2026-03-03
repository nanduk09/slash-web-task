const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 5000;

app.get("/weather", async (req, res) => {
    const { city, lat, lon } = req.query;

    try {
        let url;

        if (city) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;
        } 
        else if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`;
        } 
        else {
            return res.status(400).json({ error: "City or coordinates required" });
        }

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        res.status(500).json({ error: "City not found or API error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});