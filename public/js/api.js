async function fetchPack() {
  const res = await fetch('/api/pack');
  const data = await res.json();
  return data.cards;
}

async function fetchSpells() {
  const res = await fetch('/api/spells');
  const data = await res.json();
  return data.spells;
}

async function fetchCpuDeck() {
  const res = await fetch('/api/cpu-deck', { method: 'POST' });
  const data = await res.json();
  return data.deck;
}
