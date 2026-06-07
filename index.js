const express = require('express');
const fetch = require('node-fetch');
const {
  TOTAL_PAGES,
  PAGE_SIZE,
  PACK_SIZE,
  CPU_DECK_SIZE,
  SPELLS_SIZE,
  HP_BONUS_MIN,
  HP_BONUS_RANGE,
  POWER_DEFAULT,
  POWER_GRYFFINDOR,
  POWER_SLYTHERIN,
  POWER_HUFFLEPUFF,
  POWER_RAVENCLAW,
  MAGIC_DEFAULT,
  MAGIC_HUMAN,
  MAGIC_HALF_GIANT,
  MAGIC_GIANT,
  MAGIC_HOUSE_ELF,
  MAGIC_GHOST,
  MAGIC_WEREWOLF,
  MAGIC_VAMPIRE,
  MAGIC_CENTAUR,
  DEFENSE_DEFAULT,
  DEFENSE_PURE_BLOOD,
  DEFENSE_HALF_BLOOD,
  DEFENSE_MUGGLE_BORN,
  DEFENSE_MUGGLE,
  DEFENSE_SQUIB,
  DAMAGE_DEFAULT,
  DAMAGE_CHARM,
  DAMAGE_CURSE,
  DAMAGE_HEX,
  DAMAGE_JINX,
  DAMAGE_SPELL,
  DAMAGE_TRANSFIGURATION,
  DAMAGE_COUNTER_SPELL,
  DAMAGE_HEALING_SPELL,
} = require('./constants');

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/api/pack', async (req, res) => {
  try {
    const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;
    const response = await fetch(`https://api.potterdb.com/v1/characters?page[size]=${PAGE_SIZE}&page[number]=${randomPage}`);
    const data = await response.json();

    const characters = [];
    for (let i = 0; i < data.data.length; i += 1) {
      const character = data.data[i];
      const attributes = character.attributes;
      if (!attributes.name || attributes.name === '' || !attributes.image) continue;

      let power = POWER_DEFAULT;
      if (attributes.house === 'Gryffindor') power = POWER_GRYFFINDOR;
      if (attributes.house === 'Slytherin') power = POWER_SLYTHERIN;
      if (attributes.house === 'Hufflepuff') power = POWER_HUFFLEPUFF;
      if (attributes.house === 'Ravenclaw') power = POWER_RAVENCLAW;

      let magic = MAGIC_DEFAULT;
      if (attributes.species === 'human') magic = MAGIC_HUMAN;
      if (attributes.species === 'half-giant') magic = MAGIC_HALF_GIANT;
      if (attributes.species === 'giant') magic = MAGIC_GIANT;
      if (attributes.species === 'house elf') magic = MAGIC_HOUSE_ELF;
      if (attributes.species === 'ghost') magic = MAGIC_GHOST;
      if (attributes.species === 'werewolf') magic = MAGIC_WEREWOLF;
      if (attributes.species === 'vampire') magic = MAGIC_VAMPIRE;
      if (attributes.species === 'centaur') magic = MAGIC_CENTAUR;

      let defense = DEFENSE_DEFAULT;
      if (attributes.ancestry === 'pure-blood') defense = DEFENSE_PURE_BLOOD;
      if (attributes.ancestry === 'half-blood') defense = DEFENSE_HALF_BLOOD;
      if (attributes.ancestry === 'muggle-born') defense = DEFENSE_MUGGLE_BORN;
      if (attributes.ancestry === 'muggle') defense = DEFENSE_MUGGLE;
      if (attributes.ancestry === 'squib') defense = DEFENSE_SQUIB;

      const hp = defense + Math.floor(Math.random() * HP_BONUS_RANGE) + HP_BONUS_MIN;

      const card = {};
      card.id = character.id;
      card.name = attributes.name;
      card.house = attributes.house || 'Unknown';
      card.species = attributes.species || 'Unknown';
      card.ancestry = attributes.ancestry || 'Unknown';
      card.image = attributes.image;
      card.power = power;
      card.magic = magic;
      card.defense = defense;
      card.hp = hp;
      card.maxHp = hp;

      characters.push(card);
    }

    for (let i = characters.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = characters[i];
      characters[i] = characters[randomIndex];
      characters[randomIndex] = temp;
    }

    res.json({ cards: characters.slice(0, PACK_SIZE) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

app.get('/api/spells', async (req, res) => {
  try {
    const response = await fetch(`https://api.potterdb.com/v1/spells?page[size]=${PAGE_SIZE}`);
    const data = await response.json();

    const spells = [];
    for (let i = 0; i < data.data.length; i += 1) {
      const spell = data.data[i];
      const attributes = spell.attributes;
      if (!attributes.name || attributes.name === '') continue;

      let damage = DAMAGE_DEFAULT;
      if (attributes.category === 'Charm') damage = DAMAGE_CHARM;
      if (attributes.category === 'Curse') damage = DAMAGE_CURSE;
      if (attributes.category === 'Hex') damage = DAMAGE_HEX;
      if (attributes.category === 'Jinx') damage = DAMAGE_JINX;
      if (attributes.category === 'Spell') damage = DAMAGE_SPELL;
      if (attributes.category === 'Transfiguration') damage = DAMAGE_TRANSFIGURATION;
      if (attributes.category === 'Counter-spell') damage = DAMAGE_COUNTER_SPELL;
      if (attributes.category === 'Healing spell') damage = DAMAGE_HEALING_SPELL;

      const spellCard = {};
      spellCard.id = spell.id;
      spellCard.name = attributes.name;
      spellCard.effect = attributes.effect || 'Efeito desconhecido';
      spellCard.category = attributes.category || 'Spell';
      spellCard.light = attributes.light || 'Unknown';
      spellCard.damage = damage;

      spells.push(spellCard);
    }

    for (let i = spells.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = spells[i];
      spells[i] = spells[randomIndex];
      spells[randomIndex] = temp;
    }

    res.json({ spells: spells.slice(0, SPELLS_SIZE) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

app.post('/api/cpu-deck', async (req, res) => {
  try {
    const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;
    const response = await fetch(`https://api.potterdb.com/v1/characters?page[size]=${PAGE_SIZE}&page[number]=${randomPage}`);
    const data = await response.json();

    const characters = [];
    for (let i = 0; i < data.data.length; i += 1) {
      const character = data.data[i];
      const attributes = character.attributes;
      if (!attributes.name || attributes.name === '' || !attributes.image) continue;

      let power = POWER_DEFAULT;
      if (attributes.house === 'Gryffindor') power = POWER_GRYFFINDOR;
      if (attributes.house === 'Slytherin') power = POWER_SLYTHERIN;
      if (attributes.house === 'Hufflepuff') power = POWER_HUFFLEPUFF;
      if (attributes.house === 'Ravenclaw') power = POWER_RAVENCLAW;

      let magic = MAGIC_DEFAULT;
      if (attributes.species === 'human') magic = MAGIC_HUMAN;
      if (attributes.species === 'half-giant') magic = MAGIC_HALF_GIANT;
      if (attributes.species === 'giant') magic = MAGIC_GIANT;
      if (attributes.species === 'house elf') magic = MAGIC_HOUSE_ELF;
      if (attributes.species === 'ghost') magic = MAGIC_GHOST;
      if (attributes.species === 'werewolf') magic = MAGIC_WEREWOLF;
      if (attributes.species === 'vampire') magic = MAGIC_VAMPIRE;
      if (attributes.species === 'centaur') magic = MAGIC_CENTAUR;

      let defense = DEFENSE_DEFAULT;
      if (attributes.ancestry === 'pure-blood') defense = DEFENSE_PURE_BLOOD;
      if (attributes.ancestry === 'half-blood') defense = DEFENSE_HALF_BLOOD;
      if (attributes.ancestry === 'muggle-born') defense = DEFENSE_MUGGLE_BORN;
      if (attributes.ancestry === 'muggle') defense = DEFENSE_MUGGLE;
      if (attributes.ancestry === 'squib') defense = DEFENSE_SQUIB;

      const hp = defense + Math.floor(Math.random() * HP_BONUS_RANGE) + HP_BONUS_MIN;

      const card = {};
      card.id = character.id;
      card.name = attributes.name;
      card.house = attributes.house || 'Unknown';
      card.species = attributes.species || 'Unknown';
      card.ancestry = attributes.ancestry || 'Unknown';
      card.image = attributes.image;
      card.power = power;
      card.magic = magic;
      card.defense = defense;
      card.hp = hp;
      card.maxHp = hp;

      characters.push(card);
    }

    for (let i = characters.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = characters[i];
      characters[i] = characters[randomIndex];
      characters[randomIndex] = temp;
    }

    res.json({ deck: characters.slice(0, CPU_DECK_SIZE) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

app.listen(3000, () => {
  console.error('rodando na porta 3000');
});