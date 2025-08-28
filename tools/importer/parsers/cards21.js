/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must be exactly as specified
  const rows = [['Cards (cards21)']];

  // Find all cards in both main and extra sections
  const mainCards = element.querySelectorAll('.card-main-container .card');
  const extraCards = element.querySelectorAll('.card-extra-container .card');
  const allCards = [...mainCards, ...extraCards];

  allCards.forEach(card => {
    // First cell: image
    const img = card.querySelector('img');

    // Second cell: structured text content
    const details = card.querySelector('.card--details');
    const titleEl = details && details.querySelector('.card--title');
    const descEl = details && details.querySelector('.card--description');
    const infoEl = details && details.querySelector('.card--info');
    const ribbonEl = card.querySelector('.ribbon');

    // Compose cell content array, using references where possible
    const cellContent = [];
    if (titleEl) {
      // Use <strong> for card title to match example
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      cellContent.push(strong);
    }
    if (descEl && descEl.textContent.trim()) {
      cellContent.push(document.createElement('br'));
      cellContent.push(document.createTextNode(descEl.textContent.trim()));
    }
    if (infoEl && infoEl.textContent.trim()) {
      cellContent.push(document.createElement('br'));
      cellContent.push(document.createTextNode(infoEl.textContent.trim()));
    }
    if (ribbonEl && ribbonEl.textContent.trim()) {
      cellContent.push(document.createElement('br'));
      // Use small badge styling via <span> for ribbon content
      const badge = document.createElement('span');
      badge.textContent = ribbonEl.textContent.trim();
      badge.style.backgroundColor = '#ffd700';
      badge.style.color = '#333';
      badge.style.fontSize = '0.85em';
      badge.style.borderRadius = '5px';
      badge.style.padding = '2px 6px';
      badge.style.marginLeft = '6px';
      cellContent.push(badge);
    }
    // Always include at least title and info if present
    rows.push([
      img || '',
      cellContent.length > 0 ? cellContent : ''
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
