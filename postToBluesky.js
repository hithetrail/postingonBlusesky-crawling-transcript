const blue = require('@atproto/api');
const dotenv = require('dotenv');
const summarizeText = require('./summarizeText');
const { BskyAgent, models, RichText } = blue;

dotenv.config();

// Set default-service-url
const serviceUrl = process.env.SERVICE_URL || 'https://bsky.social/';
const agentOpts = { service: new URL(serviceUrl) };
const agent = new BskyAgent(agentOpts);

// Log in to Bluesky
(async () => {
  try {
    await agent.login({ identifier: '#your_bluesky_ID', password: '#your_bluesky_password' });
    console.log('Successfully logged in to Bluesky!');
  } catch (error) {
    console.error(error);
    throw new Error('Failed to log in to Bluesky');
  }
})();

async function postToBluesky(url, text) {
  try {
    const summaryText = await summarizeText(text); // get summary as string
    const rt = new RichText({ text: summaryText }); // pass summary as string

    // Divide the text into parts of 300 characters
    const parts = [];
    while (text.length > 0) {
      parts.push(text.substring(0, 300));
      text = text.substring(300);
    }

    // Post the first part as a new post
    const postRt = new RichText({ text: parts[0] });
    const postRecord = {
      $type: 'app.bsky.feed.post',
      text: postRt.text,
      user: agent.session.userId,
      facets: [
        {
          name: 'url',
          value: url,
          index: {
            value: 0,
            byteStart: 0,
            byteEnd: postRt.text.length,
          },
          features: [], // Add empty array as features
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const post = await agent.post(postRecord);
    const threadId = post.conversationId; // Set `threadId` to the conversation ID of the new post

  } catch (error) {
    console.error(error);
    throw new Error('Failed to post to Bluesky');
  }
}

module.exports = postToBluesky;