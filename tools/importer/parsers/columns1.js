/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Build cells array: first row is single header, second row has N columns
  const cells = [
    ['Columns (columns1)'], // Header row: exactly one column
    columns                // Second row: N columns, each cell is a column element
  ];

  // Create table using WebImporter.DOMUtils.createTable
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // The header row will be a single <th> cell, matching the example markdown

  element.replaceWith(block);
}
