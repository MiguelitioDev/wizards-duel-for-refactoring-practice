const fetch = require('node-fetch');
const { PAGE_SIZE, TOTAL_PAGES } = require('../constants');

const fetchCharacters = async () => {
  const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;
  const response = await fetch(`https://api.potterdb.com/v1/characters?page[size]=${PAGE_SIZE}&page[number]=${randomPage}`);
  const data = await response.json();
  return data.data;
};

const fetchSpells = async () => {
  const response = await fetch(`https://api.potterdb.com/v1/spells?page[size]=${PAGE_SIZE}`);
  const data = await response.json();
  return data.data;
};

module.exports = { fetchCharacters, fetchSpells };
