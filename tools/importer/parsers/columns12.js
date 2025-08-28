/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Columns (columns12)'];

  // Only one column, and all content from the element goes into a single cell
  // To reference DOM nodes, move all children to a new container
  const contentDiv = document.createElement('div');
  while (element.firstChild) {
    contentDiv.appendChild(element.firstChild);
  }

  // Build the rows for the block table
  const rows = [
    headerRow,
    [contentDiv],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
