/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the section containing the cards
  const section = element.querySelector('section.cards-wrapper');
  if (!section) return;

  // Find the card containers
  const cardMainContainer = section.querySelector('.card-container');
  const cardExtraContainer = section.querySelector('.card-extra-container');
  if (!cardMainContainer) return;

  // Get all card elements (main + extra)
  const cards = [
    ...cardMainContainer.querySelectorAll('.card'),
    ...(cardExtraContainer ? cardExtraContainer.querySelectorAll('.card') : [])
  ];

  // Build table rows: header first
  const rows = [
    ['Cards (cards11)']
  ];

  // For each card, build a row: [image, text cell]
  cards.forEach((card) => {
    // Image (first img in card)
    const img = card.querySelector('img');
    // Only add row if BOTH image and details exist (no empty cell allowed)
    const details = card.querySelector('.card--details');
    if (!img || !details) return;
    const frag = document.createDocumentFragment();
    // Title
    const title = details.querySelector('.card--title');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent;
      frag.appendChild(h3);
    }
    // Description (optional)
    const desc = details.querySelector('.card--description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // Info (e.g. exploration time)
    const info = details.querySelector('.card--info');
    if (info) {
      const span = document.createElement('span');
      span.textContent = info.textContent;
      frag.appendChild(span);
    }
    rows.push([
      img,
      frag
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original section with the table
  section.replaceWith(table);
}
