require("dotenv").config();

const express = require("express");
const cors = require("cors");

const evidenceRoutes = require("./routes/evidenceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.send("OK"));

app.use("/api/evidence", evidenceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});