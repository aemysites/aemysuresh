/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name EXACTLY as in the requirement
  const headerRow = ['Cards (cards7)'];

  // Find the main wrapper inside the block
  const wrapper = element.querySelector('.flights_stats__wrapper');

  // Find the picture (image for the first card)
  const picture = wrapper ? wrapper.querySelector('picture') : null;

  // We'll need to extract all stats cards. In this HTML, stats are NOT individual elements, but visually represented.
  // All text is part of the background image, so we only have the image itself.
  // To ensure all content is included, we reference the <picture> or <img> as the image for the card,
  // and put the entire visible block in the text cell.
  // Since the only real content is the image, and all stats are embedded as text in the image, this is what we do.

  // Get text content (if any) outside of picture (for future-proofing, e.g. if text is present as real HTML)
  let visibleText = '';
  // For robustness, check for text nodes or elements with text directly under the wrapper.
  if (wrapper) {
    Array.from(wrapper.childNodes).forEach(node => {
      if (node.nodeType === 3) {
        const t = node.textContent.trim();
        if (t) visibleText += t + ' ';
      } else if (node.nodeType === 1 && node !== picture) {
        const t = node.textContent.trim();
        if (t) visibleText += t + ' ';
      }
    });
    visibleText = visibleText.trim();
  }

  // Build the cards array: In this case only one card, with the image and any visible text (could be empty)
  const cardRows = [];
  if (picture) {
    // Reference the existing picture element
    cardRows.push([picture, visibleText || '']);
  }

  // Compose the table
  const cells = [headerRow, ...cardRows];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
