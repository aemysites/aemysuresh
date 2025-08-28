/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell, exactly as in the example
  const headerRow = ['Carousel (carousel12)'];

  // Find the only link (the CTA) in the input element
  const link = element.querySelector('a');

  // For slides: two columns per row: [image cell, text cell]; image cell empty, link in text cell
  const slideRow = ['', link];

  // Final cells array: header row is a single cell, slide row is two cells
  const cells = [headerRow, slideRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
