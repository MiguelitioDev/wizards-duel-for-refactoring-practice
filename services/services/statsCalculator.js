const {
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
} = require('../constants');

const calculatePower = (house) => {
  if (house === 'Gryffindor') return POWER_GRYFFINDOR;
  if (house === 'Slytherin') return POWER_SLYTHERIN;
  if (house === 'Hufflepuff') return POWER_HUFFLEPUFF;
  if (house === 'Ravenclaw') return POWER_RAVENCLAW;
  return POWER_DEFAULT;
};

const calculateMagic = (species) => {
  if (species === 'human') return MAGIC_HUMAN;
  if (species === 'half-giant') return MAGIC_HALF_GIANT;
  if (species === 'giant') return MAGIC_GIANT;
  if (species === 'house elf') return MAGIC_HOUSE_ELF;
  if (species === 'ghost') return MAGIC_GHOST;
  if (species === 'werewolf') return MAGIC_WEREWOLF;
  if (species === 'vampire') return MAGIC_VAMPIRE;
  if (species === 'centaur') return MAGIC_CENTAUR;
  return MAGIC_DEFAULT;
};

const calculateDefense = (ancestry) => {
  if (ancestry === 'pure-blood') return DEFENSE_PURE_BLOOD;
  if (ancestry === 'half-blood') return DEFENSE_HALF_BLOOD;
  if (ancestry === 'muggle-born') return DEFENSE_MUGGLE_BORN;
  if (ancestry === 'muggle') return DEFENSE_MUGGLE;
  if (ancestry === 'squib') return DEFENSE_SQUIB;
  return DEFENSE_DEFAULT;
};

const calculateHp = (defense) => defense + Math.floor(Math.random() * HP_BONUS_RANGE) + HP_BONUS_MIN;

const calculateDamage = (category) => {
  if (category === 'Charm') return DAMAGE_CHARM;
  if (category === 'Curse') return DAMAGE_CURSE;
  if (category === 'Hex') return DAMAGE_HEX;
  if (category === 'Jinx') return DAMAGE_JINX;
  if (category === 'Spell') return DAMAGE_SPELL;
  if (category === 'Transfiguration') return DAMAGE_TRANSFIGURATION;
  if (category === 'Counter-spell') return DAMAGE_COUNTER_SPELL;
  if (category === 'Healing spell') return DAMAGE_HEALING_SPELL;
  return DAMAGE_DEFAULT;
};

const shuffleArray = (array) => {
  const shuffled = array;
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
};

module.exports = {
  calculatePower,
  calculateMagic,
  calculateDefense,
  calculateHp,
  calculateDamage,
  shuffleArray,
};
