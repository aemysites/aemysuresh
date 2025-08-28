/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example
  const headerRow = ['Cards (cards19)'];

  // Helper: Extract image and all text content from card, referencing existing elements
  function getCardParts(card) {
    // Find the image (if any) in the card
    const img = card.querySelector('img');

    // Compose all relevant text content from the card
    const textParts = [];
    // Ribbon/marker (only in first card)
    const ribbon = card.querySelector('.ribbon');
    if (ribbon) textParts.push(ribbon); // reference, do not clone
    // Card details
    const details = card.querySelector('.card--details');
    if (details) {
      // Include all children (title, description, info)
      Array.from(details.children).forEach((el) => {
        if (el.textContent && el.textContent.trim()) {
          textParts.push(el); // reference, do not clone
        }
      });
    }
    return [img ? img : '', textParts.length ? textParts : ''];
  }

  // Find all cards, main and extra
  const cards = [];
  const mainCards = element.querySelectorAll('.card-container > .card');
  mainCards.forEach(card => cards.push(card));
  const extraCards = element.querySelectorAll('.card-extra-container > .card');
  extraCards.forEach(card => cards.push(card));

  // Build table rows: header + one row per card
  const rows = [headerRow];
  cards.forEach(card => {
    const [imgCell, textCell] = getCardParts(card);
    rows.push([imgCell, textCell]);
  });

  // Create and replace with table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
