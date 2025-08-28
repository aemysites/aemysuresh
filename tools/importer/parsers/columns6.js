/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly one cell, matching the example and guidelines
  const headerRow = ['Columns (columns6)'];

  // Gather all direct children as columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // If no columns, add an empty string so table structure is always valid
  const contentRow = columns.length > 0 ? columns : [''];

  // The cells array: header row (single cell), then a single row with as many columns as needed
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the new table
  element.replaceWith(table);
}
