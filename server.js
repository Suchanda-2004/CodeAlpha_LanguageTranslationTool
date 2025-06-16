require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static('public')); // Serve static files from a 'public' directory (where index.html, style.css, script.js reside)

// Google Translate API configuration
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Microsoft Translator API configuration (if you choose this one)
const MICROSOFT_TRANSLATOR_API_KEY = process.env.MICROSOFT_TRANSLATOR_API_KEY;
const MICROSOFT_TRANSLATOR_REGION = process.env.MICROSOFT_TRANSLATOR_REGION; // e.g., 'eastus'
const MICROSOFT_TRANSLATOR_API_URL = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';


app.post('/translate', async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !sourceLang || !targetLang) {
        return res.status(400).json({ error: 'Missing text, source language, or target language.' });
    }

    try {
        // --- Google Translate API Integration ---
        const response = await axios.post(
            `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
            {
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text',
            }
        );
        const translatedText = response.data.data.translations[0].translatedText;
        return res.json({ translatedText });


        // --- OR ---


        // --- Microsoft Translator API Integration (Uncomment and modify if using) ---
        /*
        if (!MICROSOFT_TRANSLATOR_API_KEY || !MICROSOFT_TRANSLATOR_REGION) {
            return res.status(500).json({ error: 'Microsoft Translator API key or region not configured.' });
        }

        const msResponse = await axios({
            method: 'post',
            url: `${MICROSOFT_TRANSLATOR_API_URL}&from=${sourceLang}&to=${targetLang}`,
            headers: {
                'Ocp-Apim-Subscription-Key': MICROSOFT_TRANSLATOR_API_KEY,
                'Ocp-Apim-Subscription-Region': MICROSOFT_TRANSLATOR_REGION,
                'Content-type': 'application/json',
                'X-ClientTraceId': require('uuid').v4().toString() // You might need to install 'uuid'
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        });
        const translatedText = msResponse.data[0].translations[0].text;
        return res.json({ translatedText });
        */

    } catch (error) {
        console.error('Translation API error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to translate text. Please check server logs.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
