/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards wrapper section
  const cardsWrapper = element.querySelector('.cards-wrapper');
  if (!cardsWrapper) return;

  // Grab all cards (main and extra)
  const allCards = Array.from(cardsWrapper.querySelectorAll('.card'));
  if (!allCards.length) return;

  // Table header row: block name exactly
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  allCards.forEach(card => {
    // First cell: reference the image element
    const img = card.querySelector('img');
    // Second cell: title, description (always present), info, and ribbon
    const cellContents = [];
    // Ribbon/marker
    const ribbon = card.querySelector('.ribbon');
    if (ribbon) cellContents.push(ribbon);
    // Card details container
    const details = card.querySelector('.card--details');
    if (details) {
      // Title
      const titleEl = details.querySelector('.card--title');
      if (titleEl) cellContents.push(titleEl);
      // Description: always insert a <p class="card--description">
      let descEl = details.querySelector('.card--description');
      if (!descEl) {
        descEl = document.createElement('p');
        descEl.className = 'card--description';
      }
      cellContents.push(descEl);
      // Info (Exploration time)
      const infoEl = details.querySelector('.card--info');
      if (infoEl) cellContents.push(infoEl);
    }
    // Add the row: [image, cellContents]
    rows.push([
      img || '',
      cellContents.length === 1 ? cellContents[0] : cellContents
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
