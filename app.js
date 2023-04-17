const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

var corsOptions = {
  origin: 'https://emoji575.zaiz.ai/api',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

if (process.env.NODE_ENV !== 'production') {
  require('dotenv-safe').config();
  app.use(cors())
}
app.get('/', async (req, res) => {
  res.send('Emoji 575')
})
app.get('/api', cors(corsOptions), async (req, res) => {
  if (!req.query.keywords) {
    res.send({error: 'You must provide keywords'})
  }
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.RAPID_API_HOST,
    },
    body: `{"model":"gpt-3.5-turbo","messages":[{"role":"user","content": "Generate one haiku from the following keywords: ${req.query.keywords}."}]}`,
  };
  try {
    const response = await fetch(process.env.RAPID_API_URL, options)
    const json = await response.json();
    res.send(json)
  }
  catch (error) {
    console.error(error);
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
