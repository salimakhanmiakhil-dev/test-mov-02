import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "mov.html"));
});

// API for searching movies
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ error: "Missing query" });

  try {
    const url = `https://mymoviz.co/search/?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results = [];
    // Selector دقیق برای فیلم‌ها
    $(".movies .movie").each((_, el) => {
      const title = $(el).find(".title").text().trim();
      const link = $(el).find("a").attr("href");
      const img = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
      if (title) results.push({ title, link, img });
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));