/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the main wrapper containing the image and any content
  const wrapper = element.querySelector('.flights_stats__wrapper') || element;
  // Find the <picture> element (contains image sources)
  const picture = wrapper.querySelector('picture') || wrapper.querySelector('img') || wrapper;

  // Table header must exactly match example: 'Columns (columns8)'
  const headerRow = ['Columns (columns8)'];

  // Content row: Only the image/picture is presented in this block
  const contentRow = [picture];

  // Build the table structure as required
  const cells = [headerRow, contentRow];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}