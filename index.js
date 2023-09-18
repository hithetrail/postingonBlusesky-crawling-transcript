const crawlBlog = require('./crawlTranslate');
const summarizeText = require('./summarizeText');
const postToBluesky = require('./postToBluesky');

const blogUrl = '#specific_post_url_of_your blog';
const summaryLength = 300;

async function main() {
  try {
    // 1. Crawl the blog and translate its contents
    const { title, contents } = await crawlBlog(blogUrl);

    // 2. Summarize the translated contents
    const summary = await summarizeText(contents, summaryLength);

    // 3. Post the original blog URL, summary, and translated contents to Bluesky
    await postToBluesky(blogUrl, summary);
  } catch (error) {
    console.error(error);
  }
}

main();
