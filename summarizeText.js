const { Configuration, OpenAIApi } = require('openai');
const { text } = require('./crawlTranslate');
const Axios = require('axios');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const axios = require('axios');

async function summarizeText(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `Summarize the text in 250 characters of standard English or less including blank:\n\n${text}`,
        max_tokens: 70,
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const summary = response.data.choices[0].text.trim();
    return summary;
  } catch (error) {
    console.error(error.response.data);
    throw new Error('Failed to summarize the text using OpenAI');
  }
}

module.exports = summarizeText;