const express = require('express');
const axios = require('axios');
const router = express.Router();

const {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  REDIRECT_URI,
} = process.env;

// Step 1: Redirect user to Instagram OAuth
router.get('/instagram', (req, res) => {
  const scope = 'user_profile,user_media';
  const url =
    `https://api.instagram.com/oauth/authorize` +
    `?client_id=${INSTAGRAM_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${scope}` +
    `&response_type=code`;
  res.redirect(url);
});

// Step 2: Exchange code for short-lived token, then long-lived token
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  try {
    // Exchange code for short-lived token
    const tokenRes = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const shortToken = tokenRes.data.access_token;

    // Exchange for long-lived token (60 days)
    const longRes = await axios.get(
      `https://graph.instagram.com/access_token` +
        `?grant_type=ig_exchange_token` +
        `&client_secret=${INSTAGRAM_APP_SECRET}` +
        `&access_token=${shortToken}`
    );

    const longToken = longRes.data.access_token;
    res.redirect(`http://localhost:5173?token=${longToken}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Authentication failed');
  }
});

// Step 3: Fetch user's media using stored token
router.get('/feed', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(401).send('Missing token');

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const mediaRes = await axios.get(
      `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}`
    );
    res.json(mediaRes.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Failed to fetch feed');
  }
});

module.exports = router;
