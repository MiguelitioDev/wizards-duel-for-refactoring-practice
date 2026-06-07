const state = {
  phase: 'loading',
  pack: [],
  selectedCards: [],
  playerDeck: [],
  cpuDeck: [],
  spells: [],
  playerSpells: [],
  round: 1,
  scoreP: 0,
  scoreC: 0,
  waiting: false,
};

function log(msg, type = 'info') {
  const el = document.getElementById('battleLog');
  const span = document.createElement('span');
  span.className = `log-entry ${type}`;
  span.textContent = msg;
  el.appendChild(span);
  el.scrollTop = el.scrollHeight;
}

function setStatus(msg) {
  document.getElementById('battleStatus').textContent = msg;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function getActiveIdx(deck) {
  return deck.findIndex((card) => card.hp > 0);
}

async function loadGame() {
  const bar = document.getElementById('loadBar');
  const msg = document.getElementById('loadMsg');

  msg.textContent = 'Invocando personagens...';
  bar.style.width = '20%';
  state.pack = await fetchPack();

  bar.style.width = '55%';
  msg.textContent = 'Consultando o livro de feitiços...';
  state.spells = await fetchSpells();

  bar.style.width = '85%';
  msg.textContent = 'Preparando o adversário...';
  state.cpuDeck = await fetchCpuDeck();

  const shuffled = [...state.spells].sort(() => Math.random() - 0.5);
  state.playerSpells = shuffled.slice(0, 5);

  bar.style.width = '100%';
  msg.textContent = 'Pronto!';

  setTimeout(() => {
    document.getElementById('screen-loading').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('screen-loading').style.display = 'none';
      showScreen('screen-draft');
      renderPack();
    }, 600);
  }, 400);
}

function renderPack() {
  const grid = document.getElementById('packGrid');
  grid.innerHTML = '';
  state.pack.forEach((char, i) => {
    const isSelected = state.selectedCards.includes(i);
    const div = document.createElement('div');
    div.className = `card${isSelected ? ' selected' : ''}`;
    div.innerHTML = renderCard(char);
    div.setAttribute('data-idx', i);
    div.onclick = () => toggleDraftCard(i);
    grid.appendChild(div);
  });
  document.getElementById('draftCount').textContent = state.selectedCards.length;
  document.getElementById('btnConfirmDraft').disabled = state.selectedCards.length < 2;
}

function toggleDraftCard(idx) {
  const pos = state.selectedCards.indexOf(idx);
  if (pos >= 0) {
    state.selectedCards.splice(pos, 1);
  } else {
    if (state.selectedCards.length >= 2) return;
    state.selectedCards.push(idx);
  }
  renderPack();
}

async function rerollPack() {
  state.selectedCards = [];
  document.getElementById('packGrid').innerHTML = '<div style="text-align:center;padding:40px;font-family:Cinzel,serif;font-size:0.7rem;letter-spacing:2px;color:var(--parchment-dark);grid-column:1/-1">Invocando novos bruxos...</div>';
  state.pack = await fetchPack();
  renderPack();
}

function confirmDraft() {
  if (state.selectedCards.length < 2) return;
  state.playerDeck = [state.pack[state.selectedCards[0]], state.pack[state.selectedCards[1]]];
  startBattle();
}

function startBattle() {
  state.round = 1;
  state.scoreP = 0;
  state.scoreC = 0;
  state.waiting = false;

  document.getElementById('scoreP').textContent = '0';
  document.getElementById('scoreC').textContent = '0';
  document.getElementById('roundNum').textContent = '1';
  document.getElementById('battleLog').innerHTML = '';
  document.getElementById('btnNext').style.display = 'none';

  showScreen('screen-battle');
  renderBattleState();
  log('⚔ O duelo começou! Escolha um feitiço para atacar.', 'info');
  setStatus('Escolha um feitiço para atacar!');
}

function renderBattleState() {
  const pIdx = getActiveIdx(state.playerDeck);
  const cIdx = getActiveIdx(state.cpuDeck);

  if (pIdx < 0 || cIdx < 0) { endGame(); return; }

  const pChar = state.playerDeck[pIdx];
  const cChar = state.cpuDeck[cIdx];

  document.getElementById('playerActiveName').textContent = pChar.name;
  document.getElementById('cpuActiveName').textContent = cChar.name;

  const pSlot = document.getElementById('playerCardSlot');
  const cSlot = document.getElementById('cpuCardSlot');

  const pdiv = document.createElement('div');
  pdiv.className = 'card battle-card';
  pdiv.id = 'battleCardP';
  pdiv.innerHTML = renderCard(pChar);
  pSlot.innerHTML = '';
  pSlot.appendChild(pdiv);

  const cdiv = document.createElement('div');
  cdiv.className = 'card battle-card';
  cdiv.id = 'battleCardC';
  cdiv.innerHTML = renderCard(cChar);
  cSlot.innerHTML = '';
  cSlot.appendChild(cdiv);

  renderDeckBadges(state.playerDeck, pIdx, 'playerDeckBadges');
  renderDeckBadges(state.cpuDeck, cIdx, 'cpuDeckBadges');
  renderSpells(state.playerSpells, !state.waiting);
}

function castSpell(spellIdx) {
  if (state.waiting) return;
  state.waiting = true;
  renderSpells(state.playerSpells, false);

  const sp = state.playerSpells[spellIdx];
  const pIdx = getActiveIdx(state.playerDeck);
  const cIdx = getActiveIdx(state.cpuDeck);
  const pChar = state.playerDeck[pIdx];
  const cChar = state.cpuDeck[cIdx];

  const pDmg = Math.floor(sp.damage * (pChar.magic / 100) * (Math.random() * 0.4 + 0.8));

  if (sp.damage < 0) {
    const heal = Math.abs(pDmg);
    pChar.hp = Math.min(pChar.maxHp, pChar.hp + heal);
    log(`✨ ${sp.name} – você curou ${heal} HP! (${pChar.name}: ${pChar.hp} HP)`, 'heal');
    document.getElementById('battleCardP').classList.add('battling');
    setTimeout(() => { document.getElementById('battleCardP') && document.getElementById('battleCardP').classList.remove('battling'); }, 500);
  } else {
    cChar.hp -= pDmg;
    log(`⚡ ${sp.name} → ${cChar.name} perdeu ${pDmg} HP! (${cChar.name}: ${Math.max(0, cChar.hp)} HP)`, 'win');
    document.getElementById('battleCardC').classList.add('hit');
    setTimeout(() => { document.getElementById('battleCardC') && document.getElementById('battleCardC').classList.remove('hit'); }, 600);
  }

  setTimeout(() => {
    const cpuSp = state.spells[Math.floor(Math.random() * state.spells.length)];
    const cpuDmg = Math.floor(cpuSp.damage * (cChar.magic / 100) * (Math.random() * 0.4 + 0.8));

    if (cpuSp.damage < 0) {
      const cpuHeal = Math.abs(cpuDmg);
      cChar.hp = Math.min(cChar.maxHp, cChar.hp + cpuHeal);
      log(`🧙 CPU: ${cpuSp.name} – CPU curou ${cpuHeal} HP! (${cChar.name}: ${cChar.hp} HP)`, 'heal');
      document.getElementById('battleCardC') && document.getElementById('battleCardC').classList.add('battling');
      setTimeout(() => { document.getElementById('battleCardC') && document.getElementById('battleCardC').classList.remove('battling'); }, 500);
    } else {
      pChar.hp -= cpuDmg;
      log(`💀 CPU: ${cpuSp.name} → ${pChar.name} perdeu ${cpuDmg} HP! (${pChar.name}: ${Math.max(0, pChar.hp)} HP)`, 'lose');
      document.getElementById('battleCardP') && document.getElementById('battleCardP').classList.add('hit');
      setTimeout(() => { document.getElementById('battleCardP') && document.getElementById('battleCardP').classList.remove('hit'); }, 600);
    }

    setTimeout(() => {
      let roundOver = false;

      if (pIdx >= 0 && state.playerDeck[pIdx].hp <= 0) {
        log(`💀 ${state.playerDeck[pIdx].name} foi derrotado!`, 'lose');
        state.scoreC += 1;
        document.getElementById('scoreC').textContent = state.scoreC;
        roundOver = true;
      }
      if (cIdx >= 0 && state.cpuDeck[cIdx].hp <= 0) {
        log(`🏆 ${state.cpuDeck[cIdx].name} foi derrotado!`, 'win');
        state.scoreP += 1;
        document.getElementById('scoreP').textContent = state.scoreP;
        roundOver = true;
      }

      renderBattleState();

      const pAlive = getActiveIdx(state.playerDeck);
      const cAlive = getActiveIdx(state.cpuDeck);

      if (pAlive < 0 || cAlive < 0) {
        setTimeout(endGame, 800);
        return;
      }

      state.waiting = false;

      if (roundOver) {
        state.round += 1;
        document.getElementById('roundNum').textContent = state.round;
        log(`— Rodada ${state.round} —`, 'info');
      }

      setStatus('Escolha um feitiço para atacar!');
      renderSpells(state.playerSpells, true);
    }, 700);
  }, 800);
}

function nextRound() {
  document.getElementById('btnNext').style.display = 'none';
  state.round += 1;
  document.getElementById('roundNum').textContent = state.round;
  log(`— Rodada ${state.round} —`, 'info');
  state.waiting = false;
  renderBattleState();
  setStatus('Escolha um feitiço para atacar!');
}

function endGame() {
  const over = document.getElementById('screen-over');
  const glyph = document.getElementById('overGlyph');
  const title = document.getElementById('overTitle');
  const sub = document.getElementById('overSub');
  const score = document.getElementById('overScore');

  if (state.scoreP > state.scoreC) {
    glyph.textContent = '🏆';
    title.textContent = 'Vitória!';
    sub.textContent = 'Você dominou o duelo!';
  } else if (state.scoreC > state.scoreP) {
    glyph.textContent = '💀';
    title.textContent = 'Derrota';
    sub.textContent = 'O CPU foi mais poderoso desta vez.';
  } else {
    glyph.textContent = '✦';
    title.textContent = 'Empate';
    sub.textContent = 'Bruxos igualmente poderosos.';
  }
  score.textContent = `Você ${state.scoreP}  ×  ${state.scoreC} CPU`;
  over.classList.add('active');
}

function restartGame() {
  document.getElementById('screen-over').classList.remove('active');
  state.selectedCards = [];
  state.pack = [];
  state.playerDeck = [];

  const loadEl = document.getElementById('screen-loading');
  loadEl.style.display = 'flex';
  loadEl.classList.remove('fade-out');
  document.getElementById('loadBar').style.width = '0%';
  showScreen('');
  loadGame();
}

loadGame();
