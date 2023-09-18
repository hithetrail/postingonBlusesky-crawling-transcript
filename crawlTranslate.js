const axios = require('axios');
const cheerio = require('cheerio');

const { Translate } = require('@google-cloud/translate').v2;
const dotenv = require('dotenv');
dotenv.config();

const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function translateText(text) {
  try {
    const [translation] = await translate.translate(text, 'en');
    return translation;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to translate the text');
  }
}

module.exports = translateText;

const crawlTranslate = async function crawlBlog(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const ifra = $('iframe#mainFrame');
    const postUrl = 'https://blog.naver.com' + ifra.attr('src');
    const postResponse = await axios.get(postUrl);
    const postHtml = postResponse.data;
    const post$ = cheerio.load(postHtml);

    // Extract the title and contents of the blog post
    const title = post$('div.se-module.se-module-text.se-title-text').text().replace(/\n/g, '');
    const contents = post$('div.se-module.se-module-text').find('span').toArray().map((span) => $(span).text()).join('\n');

    // Translate the text to English
    const translatedContents = await translateText(contents);

    return { title, contents: translatedContents };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch the blog');
  }
};

module.exports = crawlTranslate;
