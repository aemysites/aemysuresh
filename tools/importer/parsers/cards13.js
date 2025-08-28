/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to construct the text cell with proper structure
  function createCardText(card) {
    const frag = document.createElement('div');
    // Title (as strong, as in example)
    if (card.title) {
      const strong = document.createElement('strong');
      strong.textContent = card.title;
      frag.appendChild(strong);
    }
    // Description (as a span below title)
    if (card.description && card.description.trim()) {
      frag.appendChild(document.createElement('br'));
      const desc = document.createElement('span');
      desc.textContent = card.description;
      frag.appendChild(desc);
    }
    // Card Info (always on new line, orange in original, but leave as plain text)
    if (card.info && card.info.trim()) {
      frag.appendChild(document.createElement('br'));
      const info = document.createElement('span');
      info.textContent = card.info;
      frag.appendChild(info);
    }
    return frag;
  }

  // Find the section containing cards (robust for main & extra)
  const cards = [];

  // Main cards
  const mainCards = element.querySelectorAll('.card-container .card-main-container > .card');
  mainCards.forEach(card => {
    const img = card.querySelector('img');
    const cardImg = img || '';
    // Title (h2.card--title)
    const titleEl = card.querySelector('.card--title');
    const title = titleEl ? titleEl.textContent.trim() : '';
    // Description (p.card--description, may be missing)
    const descEl = card.querySelector('.card--description');
    const desc = descEl ? descEl.textContent.trim() : '';
    // Info (span.card--info, may be missing)
    const infoEl = card.querySelector('.card--info');
    let info = infoEl ? infoEl.textContent.trim() : '';
    // Ribbon (special label, e.g. 'Trending' – only for Gateway of India)
    const ribbonEl = card.querySelector('.ribbon');
    if (ribbonEl && ribbonEl.textContent.trim()) {
      if (info) {
        info += ' · ' + ribbonEl.textContent.trim();
      } else {
        info = ribbonEl.textContent.trim();
      }
    }
    cards.push([cardImg, createCardText({title, description: desc, info})]);
  });

  // Extra cards (if any)
  const extraCards = element.querySelectorAll('.card-extra-container > .card');
  extraCards.forEach(card => {
    const img = card.querySelector('img');
    const cardImg = img || '';
    // Title (h2.card--title)
    const titleEl = card.querySelector('.card--title');
    const title = titleEl ? titleEl.textContent.trim() : '';
    // Info (span.card--info, may be missing)
    const infoEl = card.querySelector('.card--info');
    const info = infoEl ? infoEl.textContent.trim() : '';
    cards.push([cardImg, createCardText({title, description: '', info})]);
  });

  // Compose the table
  const headerRow = ['Cards (cards13)'];
  const cells = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
