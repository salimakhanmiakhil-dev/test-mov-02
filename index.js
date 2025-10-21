const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "mov.html"));
});

// --- استخراج دیتا از mymoviz.co ---
app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "missing query" });

  try {
    const response = await axios.get(`https://mymoviz.co/search/?q=${encodeURIComponent(q)}&search=`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // 🔍 استخراج هر فیلم از HTML صفحه
    $(".ml-item").each((_, el) => {
      const title = $(el).find(".mli-info h2").text().trim();
      const link = $(el).find("a").attr("href");
      const img = $(el).find("img").attr("data-original") || $(el).find("img").attr("src");
      if (title) results.push({ title, link, img });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from mymoviz", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));