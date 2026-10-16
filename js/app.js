/**
 * Kasu brand guide app: page routing, brand switching, and data-driven rendering.
 *
 * Pages are <section data-page> blocks toggled by the URL hash so links and the
 * back button work on a static GitHub Pages host. Choosing a brand sets
 * html[data-brand-key], applies that brand's palette as semantic custom
 * properties, and re-renders every brand-dependent block from brands.js.
 */
import {
  BRANDS,
  FALLBACK_BRAND_KEY,
  LEGACY_SLOT_TO_TOKEN,
  PLATFORM_STRINGS,
  SLOT_ROLES,
  STATUS_LABELS,
} from './brands.js';

const STORAGE_KEY = 'kasuGuide.brandKey';
const DEFAULT_PAGE_ID = 'overview';
const AA_NORMAL_TEXT = 4.5;
const AA_LARGE_TEXT = 3;

/** Text/background pairings checked on the Color page. */
const CONTRAST_PAIRS = Object.freeze([
  { label: 'Body text on surface', fg: '--text', bg: '--surface', minRatio: AA_NORMAL_TEXT },
  { label: 'Secondary text on surface', fg: '--text-muted', bg: '--surface', minRatio: AA_NORMAL_TEXT },
  { label: 'Body text on raised surface', fg: '--text', bg: '--surface-raised', minRatio: AA_NORMAL_TEXT },
  { label: 'Primary on surface', fg: '--brand-primary', bg: '--surface', minRatio: AA_NORMAL_TEXT },
  { label: 'Headline emphasis on surface (large text)', fg: '--brand-secondary', bg: '--surface', minRatio: AA_LARGE_TEXT },
  { label: 'Surface text on deep primary', fg: '--surface', bg: '--brand-primary-deep', minRatio: AA_NORMAL_TEXT },
  { label: 'Hero emphasis on deep primary (large text)', fg: '--brand-accent', bg: '--brand-primary-deep', minRatio: AA_LARGE_TEXT },
  { label: 'CTA label (text) on CTA fill', fg: '--text', bg: '--brand-cta', minRatio: AA_NORMAL_TEXT },
]);

const brandsByKey = new Map(BRANDS.map((brand) => [brand.key, brand]));
const pageIds = [...document.querySelectorAll('[data-page]')].map((page) => page.dataset.page);

/* ---------- Utilities ---------- */

/** Escapes text for safe insertion into HTML. */
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** Converts a headline with *emphasis* markers into safe HTML with <em>. */
function renderEmphasis(text) {
  return escapeHtml(text).replace(/\*(.+?)\*/g, '<em>$1</em>');
}

/** Removes *emphasis* markers for plain-text display. */
function stripEmphasis(text) {
  return text.replaceAll('*', '');
}

/**
 * Parses "#RRGGBB" into [r, g, b].
 * @throws {Error} when the value is not a six-digit hex color.
 */
function hexToRgb(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!match) throw new Error(`Invalid hex color: ${hex}`);
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** WCAG 2.x relative luminance of a hex color. */
function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors (1–21). */
function contrastRatio(hexA, hexB) {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Creates an element with optional class and text. */
function createElement(tag, { className, text } = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text != null) element.textContent = text;
  return element;
}

/** Creates the standard "Placeholder" tag so stand-in content is never mistaken for real. */
function createPlaceholderTag(text = 'Placeholder') {
  const tag = createElement('span', { className: 'placeholder-tag' });
  const icon = createElement('span', { className: 'material-symbols-rounded', text: 'construction' });
  icon.setAttribute('aria-hidden', 'true');
  tag.append(icon, document.createTextNode(text));
  return tag;
}

/** Wraps stand-in copy in the highlighted placeholder-text treatment. */
function createPlaceholderText(text) {
  return createElement('span', { className: 'placeholder-text', text });
}

/** Reads the saved brand key; storage can be unavailable in private modes. */
function readSavedBrandKey() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Brand preference could not be read; using the default brand.', error);
    return null;
  }
}

/** Saves the brand key; failure only loses the preference, so it is non-fatal. */
function saveBrandKey(brandKey) {
  try {
    localStorage.setItem(STORAGE_KEY, brandKey);
  } catch (error) {
    console.warn('Brand preference could not be saved.', error);
  }
}

/* ---------- Tokens ---------- */

/** Returns the brand whose palette themes the guide (the fallback when none is tokenized). */
function getPaletteBrand(brand) {
  return brand.palette ? brand : brandsByKey.get(FALLBACK_BRAND_KEY);
}

/**
 * Builds the semantic token map from a palette's legacy slot assignments.
 * @throws {Error} when a palette leaves any semantic token unassigned.
 */
function buildTokenMap(palette) {
  const tokens = {};
  for (const swatch of palette) {
    for (const slot of swatch.slots) tokens[LEGACY_SLOT_TO_TOKEN[slot]] = swatch.hex;
  }
  const missing = Object.values(LEGACY_SLOT_TO_TOKEN).filter((token) => !tokens[token]);
  if (missing.length) throw new Error(`Palette is missing tokens: ${missing.join(', ')}`);
  return tokens;
}

/** Applies a token map to the root element, plus RGB triplets for rgba() overlays. */
function applyTokens(tokens) {
  const rootStyle = document.documentElement.style;
  for (const [token, hex] of Object.entries(tokens)) {
    rootStyle.setProperty(token, hex);
    rootStyle.setProperty(`${token}-rgb`, hexToRgb(hex).join(', '));
  }
}

/* ---------- Brand-dependent rendering ---------- */

/** Fills simple [data-brand-*] hooks with the brand's copy. */
function renderBrandHooks(brand, paletteBrand) {
  document.querySelectorAll('[data-brand-field]').forEach((element) => {
    element.textContent = brand[element.dataset.brandField] ?? '';
  });
  document.querySelectorAll('[data-brand-headline]').forEach((element) => {
    element.innerHTML = renderEmphasis(brand.headline);
  });
  document.querySelectorAll('[data-brand-status]').forEach((element) => {
    element.textContent = STATUS_LABELS[brand.status];
    element.dataset.status = brand.status;
  });
  // Concept brands without configured CTAs or labels preview the fallback brand's copy,
  // matching how the storefront inherits shared copy.
  const ctas = brand.organizerCtas.length ? brand.organizerCtas : paletteBrand.organizerCtas;
  document.querySelectorAll('[data-brand-organizer-cta]').forEach((element) => {
    element.textContent = ctas[1] ?? ctas[0];
  });
  document.querySelectorAll('[data-brand-verified]').forEach((element) => {
    element.textContent = brand.verifiedLabel ?? paletteBrand.verifiedLabel;
  });
}

/** Renders the brand sheet's fact grid, copy table, and guardrail. */
function renderBrandSheet(brand) {
  const facts = [
    ['Primary demand group', brand.demandGroup],
    ['Product promise', brand.promise],
    ['Product truth', brand.productTruth],
    ['Organizer term', brand.organizerTerm],
    ['Verified label', brand.verifiedLabel],
    ['Experience pillars', brand.pillars.join(' · ')],
    ['Tone', brand.tone],
    ['Domain', brand.domain],
  ].filter(([, value]) => value);

  const factList = document.getElementById('brandFacts');
  factList.replaceChildren(
    ...facts.map(([term, value]) => {
      const item = createElement('div', { className: 'fact' });
      item.append(createElement('dt', { text: term }), createElement('dd', { text: value }));
      return item;
    }),
  );

  const copyRows = [
    ['Signature', brand.signature],
    ['Headline', stripEmphasis(brand.headline)],
    ...(brand.organizerCtas.length ? [['Organizer CTAs', brand.organizerCtas.join(' · ')]] : []),
    ...brand.extraCopy.map(({ label, copy }) => [label, copy]),
  ];
  document.getElementById('brandCopy').replaceChildren(...copyRows.map((cells) => buildRow(cells)));

  const guardrail = document.getElementById('brandGuardrail');
  guardrail.hidden = !brand.guardrail;
  guardrail.textContent = brand.guardrail ? `Copy guardrail: ${brand.guardrail}` : '';
}

/** Builds a table row from cell text; the first cell is a row header when asked. */
function buildRow(cells, { hasRowHeader = false } = {}) {
  const row = document.createElement('tr');
  cells.forEach((cell, index) => {
    const isHeader = hasRowHeader && index === 0;
    const element = createElement(isHeader ? 'th' : 'td');
    if (isHeader) element.scope = 'row';
    if (cell instanceof Node) element.append(cell);
    else element.textContent = cell;
    row.append(element);
  });
  return row;
}

/** Renders palette swatches; concept brands show planned color names only. */
function renderSwatches(brand, tokens) {
  const note = document.getElementById('paletteNote');
  const swatches = brand.palette
    ? brand.palette
    : brand.plannedColors.map((name) => ({ name, hex: null, role: 'Planned · value pending', slots: [] }));

  if (!brand.palette) {
    note.textContent = 'These colors are named in the brand standard but not tokenized yet. Contrast and token tables below use the fallback palette.';
  } else if (brand.paletteNamesPending) {
    note.textContent = 'Color names are matched to values by role and are pending confirmation against the brand standard.';
  }
  note.hidden = !(brand.palette === null || brand.paletteNamesPending);

  document.getElementById('swatches').replaceChildren(...swatches.map((swatch) => createSwatchCard(swatch, tokens)));
}

/**
 * Builds one swatch card. Swatches without a hex show the placeholder treatment.
 * @param {object} swatch - { name, hex, role, slots? }
 * @param {object} tokens - active token map, used to pick a legible chip label color
 * @param {string} [note] - optional extra line, e.g. a contrast ratio
 */
function createSwatchCard(swatch, tokens, note) {
  const card = createElement('article', { className: 'swatch' });
  const chip = createElement('div', { className: 'swatch-chip' });
  if (swatch.hex) {
    chip.style.background = swatch.hex;
    // Label in whichever brand text token reads best on this chip.
    const textToken = contrastRatio(tokens['--text'], swatch.hex) >= contrastRatio(tokens['--surface'], swatch.hex)
      ? '--text' : '--surface';
    chip.style.color = tokens[textToken];
    chip.textContent = swatch.hex;
  } else {
    chip.classList.add('placeholder-media');
    chip.append(createPlaceholderTag(), createElement('span', { className: 'placeholder-label', text: 'Value pending' }));
  }
  const body = createElement('div', { className: 'swatch-body' });
  body.append(
    createElement('h3', { text: swatch.name }),
    createElement('p', { text: swatch.role }),
  );
  if (swatch.slots?.length) body.append(createElement('p', { className: 'swatch-slots', text: swatch.slots.join(' ') }));
  if (note) body.append(createElement('p', { className: 'swatch-slots', text: note }));
  card.append(chip, body);
  return card;
}

/** Renders status colors with their contrast against the page surface, when a brand defines them. */
function renderFunctionalColors(brand, tokens) {
  const colors = brand.functionalColors ?? [];
  document.getElementById('functionalSection').hidden = colors.length === 0;
  document.getElementById('functionalSwatches').replaceChildren(
    ...colors.map((color) => {
      const ratio = contrastRatio(color.hex, tokens['--surface']);
      // Status text is usually small, so hold it to the normal-text threshold.
      const verdict = ratio >= AA_NORMAL_TEXT ? 'passes AA as text' : 'use for fills and icons, not small text';
      return createSwatchCard(color, tokens, `${ratio.toFixed(2)}:1 on surface · ${verdict}`);
    }),
  );
}

/**
 * Renders the brand's approved photography and direction. Brands without
 * cleared photos show a placeholder rather than borrowing another brand's media.
 */
function renderPhotography(brand) {
  const photography = brand.photography;
  const direction = document.getElementById('photoDirection');
  direction.hidden = !photography;
  direction.replaceChildren(...(photography?.direction ?? []).map((line) => createElement('li', { text: line })));

  const gallery = document.getElementById('photoGallery');
  if (!photography?.photos.length) {
    const placeholder = createElement('div', { className: 'placeholder-media photo-placeholder' });
    const icon = createElement('span', { className: 'material-symbols-rounded placeholder-icon', text: 'photo_library' });
    icon.setAttribute('aria-hidden', 'true');
    placeholder.append(icon, createPlaceholderTag(), createElement('span', {
      className: 'placeholder-label',
      text: `No approved photography for ${brand.name} yet`,
    }));
    gallery.replaceChildren(placeholder);
    return;
  }

  gallery.replaceChildren(
    ...photography.photos.map((photo) => {
      const figure = createElement('figure', { className: 'photo' });
      const image = new Image(photo.width, photo.height);
      image.src = photo.src;
      image.alt = photo.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        console.error(`Photo failed to load: ${photo.src}`);
        figure.classList.add('photo--missing');
      }, { once: true });
      const caption = createElement('figcaption');
      caption.append(
        createElement('span', { className: 'photo-family', text: photo.family }),
        createElement('span', { text: photo.property }),
      );
      figure.append(image, caption);
      return figure;
    }),
  );
}

/** Renders the live contrast table for the current token map. */
function renderContrast(tokens) {
  document.getElementById('contrastTable').replaceChildren(
    ...CONTRAST_PAIRS.map((pair) => {
      const ratio = contrastRatio(tokens[pair.fg], tokens[pair.bg]);
      const passes = ratio >= pair.minRatio;
      const sample = createElement('span', { className: 'contrast-sample', text: 'Aa' });
      sample.style.color = `var(${pair.fg})`;
      sample.style.background = `var(${pair.bg})`;
      const result = createElement('span', { className: `pill ${passes ? 'pill--yes' : 'pill--no'}` });
      result.append(
        createElement('span', { className: 'material-symbols-rounded', text: passes ? 'check' : 'close' }),
        document.createTextNode(` ${passes ? 'Pass' : 'Fail'} (needs ${pair.minRatio}:1)`),
      );
      result.firstChild.setAttribute('aria-hidden', 'true');
      return buildRow([sample, pair.label, `${ratio.toFixed(2)}:1`, result]);
    }),
  );
}

/** Renders the legacy slot → semantic token table with current values. */
function renderSlotTable(tokens) {
  document.getElementById('slotTable').replaceChildren(
    ...Object.entries(LEGACY_SLOT_TO_TOKEN).map(([slot, token]) => {
      const value = createElement('span', { className: 'token-value' });
      const dot = createElement('span', { className: 'token-dot' });
      dot.style.background = `var(${token})`;
      value.append(dot, document.createTextNode(tokens[token]));
      return buildRow([createCode(slot), createCode(token), SLOT_ROLES[slot], value]);
    }),
  );
}

/** Wraps text in a <code> element. */
function createCode(text) {
  return createElement('code', { text });
}

/**
 * Loads a brand's approved vector into each [data-asset] frame. Files are added
 * to assets/logos later; until then a labeled placeholder shows instead, because
 * wordmarks must never be retyped as a substitute.
 */
function renderAssets(brand) {
  document.querySelectorAll('[data-asset]').forEach((frame) => {
    const src = brand[frame.dataset.asset];
    const isMark = frame.dataset.asset === 'monogramSrc';
    const image = new Image();
    image.alt = `${brand.name} ${isMark ? 'monogram' : 'lockup'}`;
    // Errors arrive async; ignore one from a brand the user has already switched away from.
    frame.dataset.requestedSrc = src;
    image.addEventListener('error', () => {
      if (frame.dataset.requestedSrc !== src) return;
      const placeholder = createElement('div', { className: 'placeholder-media asset-placeholder' });
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', `Placeholder: official ${brand.name} vector pending`);
      const icon = createElement('span', { className: 'material-symbols-rounded placeholder-icon', text: 'image' });
      icon.setAttribute('aria-hidden', 'true');
      placeholder.append(
        icon,
        createPlaceholderTag(),
        createElement('span', { className: 'placeholder-label', text: 'Official vector pending' }),
        createElement('code', { text: src }),
      );
      frame.replaceChildren(placeholder);
    }, { once: true });
    image.src = src;
    frame.replaceChildren(image);
  });
}

/** Shows the fallback banner for brands without a tokenized palette. */
function renderFallbackBanner(brand) {
  document.getElementById('fallbackBanner').hidden = Boolean(brand.palette);
}

/** Notes a brand's own type direction where the standard defines one. */
function renderTypeDirection(brand) {
  const note = document.getElementById('typeDirectionNote');
  note.hidden = !brand.typeDirection;
  note.textContent = brand.typeDirection ? `${brand.name} standard type direction: ${brand.typeDirection}` : '';
}

/** Marks the current brand's card as selected on the overview page. */
function renderBrandCardState(brandKey) {
  document.querySelectorAll('.brand-card').forEach((card) => {
    card.setAttribute('aria-pressed', String(card.dataset.brandKey === brandKey));
  });
}

/* ---------- Brand-independent rendering (runs once) ---------- */

function renderPlatformStrings() {
  document.getElementById('platformStrings').replaceChildren(
    ...PLATFORM_STRINGS.map(({ key, copy }) => buildRow([key, copy], { hasRowHeader: true })),
  );
}

function renderVocabTable() {
  document.getElementById('vocabTable').replaceChildren(
    ...BRANDS.map((brand) => buildRow(
      [
        brand.name,
        brand.signature,
        brand.organizerTerm ?? createPlaceholderText('Not yet configured'),
        brand.verifiedLabel ?? createPlaceholderText('Not yet configured'),
      ],
      { hasRowHeader: true },
    )),
  );
}

function renderBrandCards() {
  document.getElementById('brandCards').replaceChildren(
    ...BRANDS.map((brand) => {
      const card = createElement('button', { className: 'brand-card' });
      card.type = 'button';
      card.dataset.brandKey = brand.key;
      const status = createElement('span', { className: 'status-tag', text: STATUS_LABELS[brand.status] });
      status.dataset.status = brand.status;
      card.append(
        status,
        createElement('span', { className: 'brand-card-name', text: brand.name }),
        createElement('span', { className: 'brand-card-signature', text: brand.signature }),
        createElement('span', { className: 'brand-card-promise', text: brand.promise }),
      );
      card.addEventListener('click', () => setBrand(brand.key));
      return card;
    }),
  );
}

function populateBrandSelect() {
  const select = document.getElementById('brandSelect');
  select.replaceChildren(...BRANDS.map((brand) => new Option(brand.name, brand.key)));
  select.addEventListener('change', () => setBrand(select.value));
}

/* ---------- State ---------- */

/** Switches the active brand, re-themes the guide, and re-renders brand blocks. */
function setBrand(requestedKey) {
  const brand = brandsByKey.get(requestedKey) ?? brandsByKey.get(FALLBACK_BRAND_KEY);
  const paletteBrand = getPaletteBrand(brand);
  const tokens = buildTokenMap(paletteBrand.palette);

  document.documentElement.dataset.brandKey = brand.key;
  applyTokens(tokens);
  document.getElementById('brandSelect').value = brand.key;

  renderBrandHooks(brand, paletteBrand);
  renderBrandSheet(brand);
  renderSwatches(brand, tokens);
  renderContrast(tokens);
  renderSlotTable(tokens);
  renderFunctionalColors(brand, tokens);
  renderAssets(brand);
  renderPhotography(brand);
  renderFallbackBanner(brand);
  renderTypeDirection(brand);
  renderBrandCardState(brand.key);
  saveBrandKey(brand.key);
}

/** Shows the page named by the URL hash, defaulting to the overview. */
function showPageFromHash({ shouldFocus = true } = {}) {
  const requestedId = location.hash.slice(1);
  const pageId = pageIds.includes(requestedId) ? requestedId : DEFAULT_PAGE_ID;

  document.querySelectorAll('[data-page]').forEach((page) => {
    page.hidden = page.dataset.page !== pageId;
  });
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.getAttribute('href') === `#${pageId}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('.nav-group').forEach((group) => {
    group.classList.toggle('is-current', Boolean(group.querySelector('[aria-current="page"]')));
  });

  closeMenus();
  window.scrollTo(0, 0);
  // Move focus to the new content so keyboard and screen-reader users land on it.
  if (shouldFocus) document.getElementById('main').focus({ preventScroll: true });
}

/* ---------- Navigation ---------- */

/** Closes every dropdown, and the mobile menu. */
function closeMenus() {
  document.querySelectorAll('.nav-group-toggle').forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  document.getElementById('siteNav').classList.remove('is-open');
}

function initNavigation() {
  document.querySelectorAll('.nav-group-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
      document.querySelectorAll('.nav-group-toggle').forEach((other) => other.setAttribute('aria-expanded', 'false'));
      toggle.setAttribute('aria-expanded', String(shouldOpen));
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('siteNav');
  menuToggle.addEventListener('click', () => {
    const shouldOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    nav.classList.toggle('is-open', shouldOpen);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenus();
  });
  window.addEventListener('hashchange', () => showPageFromHash());
}

/* ---------- Boot ---------- */

renderPlatformStrings();
renderVocabTable();
renderBrandCards();
populateBrandSelect();
initNavigation();
setBrand(readSavedBrandKey() ?? FALLBACK_BRAND_KEY);
showPageFromHash({ shouldFocus: false });
