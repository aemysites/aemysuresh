/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, per block spec
  const headerRow = ['Table (no header, tableNoHeader3)'];
  // Get all direct children of the element (should be two divs)
  const rows = Array.from(element.querySelectorAll(':scope > div')).map(div => [div]);
  // Edge case: if no child divs, create empty rows (not applicable here, but for resilience)
  const cells = [headerRow, ...rows];
  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the table block
  element.replaceWith(block);
}
