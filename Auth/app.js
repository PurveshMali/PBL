const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());

// Import routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const HF_API_URL =
  "https://api-inference.huggingface.co/models/google/flan-t5-large";
const HF_API_KEY = process.env.HF_API_KEY;

app.get("/insights", async (req, res) => {
  try {
    const prompt =
      "Generate four real-time insights on energy emissions, fuel efficiency, and environmental impact based on current studies.";

    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    res.json(response.data[0].generated_text.split("\n"));
    console.log(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching AI insights" });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
