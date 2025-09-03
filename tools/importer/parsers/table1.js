/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Header row as required
  const headerRow = ['Table (table1)'];

  // Extract all text content from the element (including children)
  const text = element.textContent.trim();

  // Only add a data row if there is actual content
  const tableData = [headerRow];
  if (text.length > 0) {
    tableData.push([text]);
  }

  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
