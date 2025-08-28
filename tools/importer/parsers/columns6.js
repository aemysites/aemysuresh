/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate children as columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Header row should be exactly one cell
  const headerRow = ['Columns (columns6)'];
  const contentRow = columns.length ? columns : [''];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}