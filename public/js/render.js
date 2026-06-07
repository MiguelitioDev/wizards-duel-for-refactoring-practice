function getHouseColor(house) {
  if (house === 'Gryffindor') return '#6b1010';
  if (house === 'Slytherin') return '#0a3018';
  if (house === 'Hufflepuff') return '#3a2800';
  if (house === 'Ravenclaw') return '#0a1a3a';
  return '#1e1040';
}

function getHouseEmoji(house) {
  if (house === 'Gryffindor') return '🦁';
  if (house === 'Slytherin') return '🐍';
  if (house === 'Hufflepuff') return '🦡';
  if (house === 'Ravenclaw') return '🦅';
  return '✦';
}

function hpColor(pct) {
  if (pct > 0.6) return 'linear-gradient(90deg,#0a4a2a,#22cc77)';
  if (pct > 0.3) return 'linear-gradient(90deg,#4a3a00,#ccaa22)';
  return 'linear-gradient(90deg,#4a0a0a,#cc2222)';
}

function renderCard(char) {
  const pct = char.hp / char.maxHp;
  const houseColor = getHouseColor(char.house);
  const houseEmoji = getHouseEmoji(char.house);
  const fallback = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';

  return `
    <div class="card-img">
      <img src="${char.image}" alt="${char.name}" onerror="this.src='${fallback}'">
      <div class="house-badge" style="background:${houseColor}">${houseEmoji}</div>
    </div>
    <div class="card-body">
      <div class="card-name">${char.name}</div>
      <div class="card-meta">${char.species} · ${char.house}</div>
      <div class="hp-bar-wrap">
        <span class="hp-label">HP</span>
        <div class="hp-track">
          <div class="hp-fill" style="width:${Math.max(0, pct * 100)}%;background:${hpColor(pct)}"></div>
        </div>
        <span class="hp-val">${Math.max(0, char.hp)}/${char.maxHp}</span>
      </div>
      <div class="mini-stats">
        <div class="mini-stat">
          <span class="mini-stat-icon">⚡</span>
          <span class="mini-stat-val">${char.power}</span>
          <span class="mini-stat-lbl">Poder</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-icon">🔮</span>
          <span class="mini-stat-val">${char.magic}</span>
          <span class="mini-stat-lbl">Magia</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-icon">🛡</span>
          <span class="mini-stat-val">${char.defense}</span>
          <span class="mini-stat-lbl">Defesa</span>
        </div>
      </div>
    </div>`;
}

function renderDeckBadges(deck, activeIdx, elId) {
  const el = document.getElementById(elId);
  const fallback = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';
  el.innerHTML = deck.map((card, i) => {
    const getRenderClass = (deckCard, cardIndex, currentActiveIdx) => {
      if (deckCard.hp <= 0) return 'deck-thumb dead';
      if (cardIndex === currentActiveIdx) return 'deck-thumb active';
      return 'deck-thumb';
    };
    const cls = getRenderClass(card, i, activeIdx);
    return `<div class="${cls}"><img src="${card.image}" onerror="this.src='${fallback}'"></div>`;
  }).join('');
}

function renderSpells(playerSpells, enabled) {
  const el = document.getElementById('spellList');
  el.innerHTML = playerSpells.map((sp, i) => {
    const isHeal = sp.damage < 0;
    const dmgLabel = isHeal ? `💚 +${Math.abs(sp.damage)} HP` : `💀 ${sp.damage} dmg`;
    const dmgClass = isHeal ? 'spell-dmg heal' : 'spell-dmg attack';
    const dis = enabled ? '' : 'disabled';
    return `
      <button class="spell-btn" ${dis} onclick="castSpell(${i})">
        <div>
          <span class="spell-name">${sp.name}</span>
          <span class="spell-effect">${sp.effect}</span>
        </div>
        <span class="${dmgClass}">${dmgLabel}</span>
      </button>`;
  }).join('');
}
