/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns2)'];
  // Get all immediate children (columns)
  const columns = Array.from(element.children);
  // Only include columns that have actual content (not empty)
  const contentRow = columns
    .map(col => {
      // If column has content, clone all children into a fragment
      if (col.textContent.trim() || col.querySelector('*')) {
        const frag = document.createDocumentFragment();
        Array.from(col.childNodes).forEach(node => frag.appendChild(node.cloneNode(true)));
        return frag;
      }
      // If column is truly empty, skip it (do not add empty columns)
      return null;
    })
    .filter(cell => cell !== null);
  // Only add content row if there is at least one non-empty column
  const cells = [headerRow];
  if (contentRow.length > 0) {
    cells.push(contentRow);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(table);
}
