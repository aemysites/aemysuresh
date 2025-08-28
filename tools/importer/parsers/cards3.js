/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Cards (cards3)'];

  // The provided HTML is a single image-based card, no inner text blocks
  // Find the picture element for the card's image
  const wrapper = element.querySelector('.flights_stats__wrapper');
  let picture = null;
  if (wrapper) {
    picture = wrapper.querySelector('picture');
  }

  // Only create a card row if picture was found
  const cardRows = [];
  if (picture) {
    // There is no text content in the HTML so the second cell is empty
    cardRows.push([picture, '']);
  }

  // Create the block table - no Section Metadata per the example
  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
