/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example: 'Cards (cards3)'
  const headerRow = ['Cards (cards3)'];

  // Find the wrapper containing the card content
  const wrapper = element.querySelector('.flights_stats__wrapper');
  let imageEl = null;
  if (wrapper) {
    const picture = wrapper.querySelector('picture');
    if (picture) {
      // Reference the <img> element for the card image
      imageEl = picture.querySelector('img');
    }
  }

  // There is no section metadata in the example markdown, so do not create such block.

  // The screenshot shows a main stat (2,300+ Daily Flights) and 4 smaller stats
  // The stats themselves do not appear in the HTML. To avoid hardcoding,
  // we should extract only what is present in the HTML.
  // However, the source HTML contains only an image; no text.

  // Therefore, the only content to extract is the image itself.
  // The block should contain a single card row: image only in the first cell, empty second cell.

  // If there's an image, create a card with the image and empty text cell
  const cardRow = imageEl ? [imageEl, ''] : ['', ''];

  const cells = [
    headerRow,
    cardRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
