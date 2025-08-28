/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate children (columns)
  const columns = Array.from(element.querySelectorAll(':scope > *'));
  // Header row must be a single cell, matching the example
  const headerRow = ['Columns (columns6)'];
  // Content row: each column cell
  const contentRow = columns;
  // Build table with single-cell header, multi-column content
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  // Replace original element with the new block table
  element.replaceWith(table);
}