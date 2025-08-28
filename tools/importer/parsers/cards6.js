/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: If element is empty, do nothing
  if (!element || !element.children || element.children.length === 0) return;

  // Table header: exact match to spec
  const headerRow = ['Cards (cards6)'];
  const tableRows = [headerRow];

  // Each direct child is one card placeholder (no text, just gradient boxes)
  Array.from(element.children).forEach((cardPlaceholder) => {
    // First cell: existing gradient div
    // Second cell: an empty div (no text in skeleton)
    const emptyDiv = document.createElement('div');
    tableRows.push([cardPlaceholder, emptyDiv]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}