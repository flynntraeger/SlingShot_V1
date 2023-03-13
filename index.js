
// 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

const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios');

const configuration = new Configuration({
    organization: "org-fvqEELdOaruCH0K2h9K1MLPC",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3080

app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    // console.log(message);
    const response = await openai.createCompletion({
        // model:  `${currentModel}`, // "text-davinci-003"
        model: "gpt-3.5-turbo", // "text-davinci-003"
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0.2,
    });
    console.log(response)
    res.json({
        message: response.data.choices[0].text
    })
});

app.post('/turbo', async (req, res) => {
    const { messages } = req.body;
    console.log(messages)
    // const completion = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: `${messages}`,
    // });
    // console.log(completion.data.choices[0].message);
    // res.json({
    //     message: completion.data.choices[0].message
    // })

    var data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": messages
    });
    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer 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"
        },
        data: data
    };
    let newCompletion = await axios(config)
    console.log(newCompletion.data.choices[0].message)
    res.json({
        message: newCompletion.data.choices[0].message.content
    })
});

app.get('/models', async (req, res) => {
    const response = await openai.listEngines();
    console.log(response)
    res.json({
        models: response.data
    })
});

app.listen(port, () => {
    console.log(`example app listening at http://localhost:${port}`)
})