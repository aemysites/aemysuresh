/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block spec
  const cells = [['Cards (cards19)']];

  // Card rows: each card = [image, text-content]
  // Find all cards from both main and extra containers
  const mainContainer = element.querySelector('.card-main-container');
  const extraContainer = element.querySelector('.card-extra-container');
  const allCards = [];
  if (mainContainer) {
    mainContainer.querySelectorAll('.card').forEach(card => allCards.push(card));
  }
  if (extraContainer) {
    extraContainer.querySelectorAll('.card').forEach(card => allCards.push(card));
  }

  allCards.forEach(card => {
    // First cell: image
    const img = card.querySelector('img');
    // Second cell: title, description, info, and ribbon (if present)
    const cardDetails = card.querySelector('.card--details');
    const cellContent = [];
    if (cardDetails) {
      // Title (h2)
      const title = cardDetails.querySelector('.card--title');
      if (title) cellContent.push(title);
      // Description (p), sometimes missing
      const desc = cardDetails.querySelector('.card--description');
      if (desc) cellContent.push(desc);
      // Info (span), exploration time
      const info = cardDetails.querySelector('.card--info');
      if (info) cellContent.push(info);
    }
    // Ribbon (Trending, etc) may be outside details
    const ribbon = card.querySelector('.ribbon');
    if (ribbon) cellContent.push(ribbon);
    cells.push([
      img,
      cellContent
    ]);
  });

  // Replace element with table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
