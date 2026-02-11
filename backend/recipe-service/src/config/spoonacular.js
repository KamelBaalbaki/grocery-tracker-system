const axios = require('axios');

const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com',
  params: {
    apiKey: process.env.SPOONACULAR_API_KEY
  }
});

module.exports = spoonacular;
