/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header
  const cells = [['Cards (cards3)']];

  // The provided HTML contains one large image which is likely a visual summary of the cards,
  // but no individual card markup. We'll treat the image as the single card for this block.

  const wrapper = element.querySelector('.flights_stats__wrapper');
  if (wrapper) {
    const picture = wrapper.querySelector('picture');
    if (picture) {
      // Use the picture as the image cell
      // There is no associated text, so the second cell is left empty
      cells.push([picture, '']);
    }
  }

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
