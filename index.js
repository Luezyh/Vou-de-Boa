/* ══════════════════════════════════════════════
   PASSEIO APP — script.js
══════════════════════════════════════════════ */

'use strict';

// ─── ESTADO ───────────────────────────────────
const state = {
  currentTab: 'inicio',
  favorites: [],
  visited: [],
  searchQuery: '',
  activeFilter: 'todos',
};

// ─── DADOS DOS LUGARES (para modal) ──────────
const places = {
  'Parque do Ibirapuera': {
    emoji: '🌳',
    desc: 'O maior parque urbano de SP com 1,6 km². Museu de Arte Moderna, lago, ciclovias e muito verde. Entrada completamente gratuita todos os dias.',
  },
  'MASP': {
    emoji: '🏛️',
    desc: 'Museu de Arte de São Paulo — acervo com mais de 8.000 obras. Entrada gratuita todas as terças-feiras. Às margens da Av. Paulista.',
  },
  'Pinacoteca': {
    emoji: '🎨',
    desc: 'Maior museu de artes visuais do Brasil, com obras do século XIX até a arte contemporânea. Entrada gratuita aos sábados.',
  },
  'Parque Trianon': {
    emoji: '🌲',
    desc: 'Um pedaço de Mata Atlântica no coração da Avenida Paulista. Entrada gratuita. Perfeito para uma pausa verde no dia a dia.',
  },
  'Feira da Liberdade': {
    emoji: '🏮',
    desc: 'A maior feira oriental fora do Japão. Toda domingo na Praça da Liberdade. Gastronomia, cultura e artesanato japonês. Gratuita.',
  },
  'Centro Cultural SP': {
    emoji: '🎭',
    desc: 'Espaço cultural com teatro, cinema, biblioteca e exposições. Programação variada e sempre gratuita.',
  },
  'Museu do Ipiranga': {
    emoji: '🏺',
    desc: 'Museu histórico com acervo sobre a Independência do Brasil. Recém-reformado e lindo! Gratuito aos domingos.',
  },
  'Concerto Villa-Lobos': {
    emoji: '🎵',
    desc: 'Concerto da Orquestra Sinfônica Brasileira ao ar livre no Parque Villa-Lobos. Sábado, 01 Jun às 16h. Gratuito e inesquecível!',
  },
};

// ─── NAVEGAÇÃO DE ABAS ────────────────────────
function switchTab(tabId) {
  if (state.currentTab === tabId) return;

  // Remove active de todos
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Ativa o novo
  const section = document.getElementById('tab-' + tabId);
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (section) section.classList.add('active');
  if (btn) btn.classList.add('active');

  state.currentTab = tabId;

  // Atualiza favoritos quando entra na aba
  if (tabId === 'favoritos') renderFavs();
  if (tabId === 'perfil') updateProfileStats();
}

// ─── FAVORITOS ────────────────────────────────
function toggleFav(event, btn) {
  event.stopPropagation();
  const card = btn.closest('.place-card, .grid-card');
  const name = card?.querySelector('h4')?.textContent?.trim();
  if (!name) return;

  if (state.favorites.includes(name)) {
    state.favorites = state.favorites.filter(f => f !== name);
    btn.classList.remove('active');
    showToast('Removido dos favoritos');
  } else {
    state.favorites.push(name);
    btn.classList.add('active');
    showToast('❤️ Adicionado aos favoritos!');
  }

  // Sincroniza todos os botões com o mesmo nome
  syncFavButtons(name, state.favorites.includes(name));
  updateProfileStats();
}

function syncFavButtons(name, isActive) {
  document.querySelectorAll('.place-card, .grid-card').forEach(card => {
    const cardName = card.querySelector('h4')?.textContent?.trim();
    if (cardName === name) {
      const btn = card.querySelector('.fav-btn');
      if (btn) btn.classList.toggle('active', isActive);
    }
  });
}

function renderFavs() {
  const emptyEl = document.getElementById('empty-favs');
  const listEl  = document.getElementById('favs-list');

  if (!state.favorites.length) {
    emptyEl.classList.remove('hidden');
    listEl.classList.add('hidden');
    return;
  }

  emptyEl.classList.add('hidden');
  listEl.classList.remove('hidden');

  listEl.innerHTML = state.favorites.map(name => {
    const info = places[name] || { emoji: '📍', desc: 'Lugar incrível!' };
    return `
      <div class="place-card">
        <div class="place-img" style="background:linear-gradient(135deg,#ffe0c8,#ff8c42)">
          <span class="place-emoji">${info.emoji}</span>
        </div>
        <div class="place-info">
          <h4>${name}</h4>
          <p>${info.desc.substring(0, 60)}…</p>
          <div class="place-meta">
            <span class="tag tag-free">Favorito</span>
          </div>
        </div>
        <button class="fav-btn active" aria-label="Remover" onclick="removeFavByName(event,'${name}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>`;
  }).join('');
}

function removeFavByName(event, name) {
  event.stopPropagation();
  state.favorites = state.favorites.filter(f => f !== name);
  syncFavButtons(name, false);
  renderFavs();
  updateProfileStats();
  showToast('Removido dos favoritos');
}

// ─── PERFIL STATS ─────────────────────────────
function updateProfileStats() {
  const el = document.getElementById('stat-favs');
  const el2 = document.getElementById('stat-visited');
  if (el)  el.textContent  = state.favorites.length;
  if (el2) el2.textContent = state.visited.length;
}

// ─── MODAL DE LUGAR ───────────────────────────
function openPlace(name) {
  const info = places[name] || { emoji: '📍', desc: 'Um lugar incrível para visitar!' };
  document.getElementById('modal-title').textContent = name;
  document.getElementById('modal-desc').textContent  = info.desc;
  document.getElementById('modal-emoji').textContent = info.emoji;
  document.getElementById('modal').classList.add('active');

  // Marcar como visitado
  if (!state.visited.includes(name)) {
    state.visited.push(name);
    updateProfileStats();
  }
}

function closeModal(event) {
  if (!event || event.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('active');
  }
}

// ─── SEARCH & FILTER (PROCURAR) ───────────────
const searchInput  = document.getElementById('search-input');
const clearBtn     = document.getElementById('clear-search');
const placesGrid   = document.getElementById('places-grid');
const emptyState   = document.getElementById('empty-state');
const resultsNum   = document.getElementById('results-num');

function filterGrid() {
  const q       = state.searchQuery.toLowerCase();
  const filter  = state.activeFilter;
  const cards   = placesGrid.querySelectorAll('.grid-card');
  let visible   = 0;

  cards.forEach(card => {
    const name = card.querySelector('h4')?.textContent.toLowerCase() || '';
    const cat  = card.dataset.cat || '';
    const matchQ = !q || name.includes(q);
    const matchF = filter === 'todos' || cat === filter;

    if (matchQ && matchF) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  if (resultsNum) resultsNum.textContent = visible;
  emptyState.classList.toggle('hidden', visible > 0);
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    state.searchQuery = searchInput.value;
    clearBtn.classList.toggle('visible', !!searchInput.value);
    filterGrid();
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearBtn.classList.remove('visible');
    filterGrid();
    searchInput.focus();
  });
}

// Filter chips
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.activeFilter = chip.dataset.filter;
    filterGrid();
  });
});

// Category chips (inicio)
document.querySelectorAll('.cat-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ─── TOAST ────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ─── FECHAR MODAL COM ESC ─────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal({});
});

// ─── INIT ─────────────────────────────────────
updateProfileStats();