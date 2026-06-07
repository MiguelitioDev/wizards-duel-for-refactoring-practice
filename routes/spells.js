const express = require('express');
const { fetchSpells } = require('../services/potterApi');
const { calculateDamage, shuffleArray } = require('../services/statsCalculator');
const { SPELLS_SIZE } = require('../constants');

const router = express.Router();

router.get('/spells', async (req, res) => {
  try {
    const rawSpells = await fetchSpells();

    const spells = rawSpells
      .filter((spell) => spell.attributes.name && spell.attributes.name !== '')
      .map((spell) => {
        const { attributes } = spell;
        return {
          id: spell.id,
          name: attributes.name,
          effect: attributes.effect || 'Efeito desconhecido',
          category: attributes.category || 'Spell',
          light: attributes.light || 'Unknown',
          damage: calculateDamage(attributes.category),
        };
      });

    const shuffled = shuffleArray(spells);
    res.json({ spells: shuffled.slice(0, SPELLS_SIZE) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

module.exports = router;
