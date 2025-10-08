require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const OpenAI = require("openai");

// Note: axios and cheerio are no longer needed for this approach

const app = express();
const PORT = process.env.PORT || 3001;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

async function extractFoodItemFromQuery(query) {
  console.log("Decoding query with AI...");
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.log("OPENAI_API_KEY not found or not set. Falling back to simple keyword extraction.");
    const simplifiedQuery = query.toLowerCase().replace(/i would like to eat some|looking for|where can i find|i need/gi, "").trim();
    const foodItem = simplifiedQuery.split(" ").pop();
    console.log(`Fallback extraction: \"${query}\" to -> \"${foodItem}\"`);
    return foodItem;
  }

  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const prompt = `From the following user query, extract only the name of the food item they want to eat.\nReturn only the food item name and nothing else.\n    Query: "${query}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": prompt }],
      temperature: 0,
      max_tokens: 60,
    });

    const foodItem = response.choices[0].message.content.trim().toLowerCase();
    console.log(`AI decoded "${query}" to -> "${foodItem}"`);
    return foodItem;
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    console.log("Falling back to simple keyword extraction due to API error.");
    const simplifiedQuery = query.toLowerCase().replace(/i would like to eat some|looking for|where can i find|i need/gi, "").trim();
    const foodItem = simplifiedQuery.split(" ").pop();
    console.log(`Fallback extraction: "${query}" to -> "${foodItem}"`);
    return foodItem;
  }
}

app.get('/api/search', async (req, res) => {
  const { query, lat, lon } = req.query;

  if (!query || !lat || !lon) {
    return res.status(400).json({ error: 'Query, latitude, and longitude are required.' });
  }

  try {
    const foodItem = await extractFoodItemFromQuery(query);
    const storesPath = path.join(__dirname, 'stores.json');
    const data = fs.readFileSync(storesPath, 'utf8');
    const stores = JSON.parse(data);

    const results = stores
      .filter(store => store.search_url) // Only include stores that have a search_url
      .map(store => {
        const storeSearchUrl = store.search_url.replace('<criteria>', encodeURIComponent(foodItem));
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name)}`;
        
        return {
          ...store,
          storeSearchUrl,
          googleMapsUrl,
        };
      });

    res.json({ source: 'url_search', results: results });

  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});