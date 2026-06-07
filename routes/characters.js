const express = require('express');
const { fetchCharacters } = require('../services/potterApi');
const { calculatePower, calculateMagic, calculateDefense, calculateHp, shuffleArray } = require('../services/statsCalculator');
const { PACK_SIZE } = require('../constants');

const router = express.Router();

router.get('/pack', async (req, res) => {
  try {
    const rawCharacters = await fetchCharacters();

    const characters = rawCharacters
      .filter((character) => character.attributes.name && character.attributes.name !== '' && character.attributes.image)
      .map((character) => {
        const attributes = character.attributes;
        const defense = calculateDefense(attributes.ancestry);
        const hp = calculateHp(defense);

        return {
          id: character.id,
          name: attributes.name,
          house: attributes.house || 'Unknown',
          species: attributes.species || 'Unknown',
          ancestry: attributes.ancestry || 'Unknown',
          image: attributes.image,
          power: calculatePower(attributes.house),
          magic: calculateMagic(attributes.species),
          defense,
          hp,
          maxHp: hp,
        };
      });

    const shuffled = shuffleArray(characters);
    res.json({ cards: shuffled.slice(0, PACK_SIZE) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

module.exports = router;