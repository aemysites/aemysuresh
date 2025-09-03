/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main cards container
  const cardsContainer = element.querySelector('.cards-conatiner');
  if (!cardsContainer) return;

  // Find all card elements (main and extra)
  const cardNodes = [
    ...cardsContainer.querySelectorAll('.card-container > .card'),
    ...cardsContainer.querySelectorAll('.card-extra-container > .card')
  ];

  // Table header row
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  cardNodes.forEach(card => {
    // Get image
    const img = card.querySelector('img');

    // Get card details
    const details = card.querySelector('.card--details');
    let textContent = [];
    if (details) {
      // Title
      const title = details.querySelector('.card--title');
      if (title) {
        const h = document.createElement('h3');
        h.textContent = title.textContent;
        textContent.push(h);
      }
      // Description (optional)
      const desc = details.querySelector('.card--description');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textContent.push(p);
      }
      // Info (exploration time)
      const info = details.querySelector('.card--info');
      if (info) {
        const span = document.createElement('span');
        span.textContent = info.textContent;
        textContent.push(span);
      }
    }
    // Ribbon (Trending)
    const ribbon = card.querySelector('.ribbon');
    if (ribbon) {
      const r = document.createElement('span');
      r.textContent = ribbon.textContent;
      r.className = 'card-ribbon';
      textContent.unshift(r); // Add at top
    }
    // Defensive: ensure image and text
    // FIX: Add fallback for missing description and info by using data-model JSON
    if (textContent.length === 0) {
      // Try to get from data-model JSON
      const section = element.closest('section[data-model]');
      if (section) {
        try {
          const model = JSON.parse(section.getAttribute('data-model').replace(/&quot;/g, '"'));
          const idx = parseInt(card.getAttribute('data-index'), 10);
          const cardData = model[idx];
          if (cardData) {
            if (cardData.title) {
              const h = document.createElement('h3');
              h.textContent = cardData.title;
              textContent.push(h);
            }
            if (cardData.description) {
              const p = document.createElement('p');
              p.textContent = cardData.description;
              textContent.push(p);
            }
            if (cardData.label) {
              const span = document.createElement('span');
              span.textContent = cardData.label;
              textContent.push(span);
            }
            if (cardData.marker) {
              const r = document.createElement('span');
              r.textContent = cardData.marker;
              r.className = 'card-ribbon';
              textContent.unshift(r);
            }
          }
        } catch(e) {}
      }
    }
    rows.push([
      img || '',
      textContent.length > 1 ? textContent : textContent[0] || ''
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
