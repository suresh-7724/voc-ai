//IMPORT
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
require('dotenv').config();
const showdown = require('showdown');
const axios = require('axios');
const http = require('http');

//INITIALIZE
const app = express();
app.use(cors());
const PORT = process.env.PORT;
app.use(bodyParser.json());
const ApiKey = process.env.API_KEY;

app.get("/" , async (req,res)=>{
    res.json({"message":"hi"})
} )

app.post('/translate', async (req, res) => {
    const { word } = req.body;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer "+ApiKey);
    // Remove cookie line if not required by OpenAI

    const raw = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": "you are an expert linguist and tutor of languages. We want to help english speakers learn foriegn words. I'll provide a foriegn word, and context and you provide me with the following:\n1. Literal translation of that word. If the translation within the context is different than the literal translation then add that as well. No more than 50 charachters.\n2. example for using this word in word in a sentence. no more than 50 charachters.\n3. If the word is a verb, conjugations for all relevant aspects \n4. three suggestions how an English speaker should memorize that word using word associaltions. response json , use memorization_tips as a key only,Given Word:"+word
            }
        ],
        "temperature": 1,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "max_tokens": 250,
        "presence_penalty": 0,
        "frequency_penalty": 0
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(response => response.json())
        .then(result => res.json(result))
        .catch(error => {
            console.error(error); // Log the actual error for debugging
            res.status(500).json({ message: "An error occured during translation." }); // Informative error message for user
        });
});
//LISTEN
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
