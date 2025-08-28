/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct card elements
  const cards = Array.from(element.querySelectorAll(':scope > .comment'));
  // Build table rows: each row is [image or placeholder, text content]
  const rows = [];
  cards.forEach((card) => {
    // Reference existing element directly
    rows.push([card, '']);
  });
  // Create table manually so the header row is a single cell spanning two columns
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Cards (cards7)';
  th.colSpan = 2;
  headerRow.appendChild(th);
  table.appendChild(headerRow);
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.textContent = cell;
      } else {
        td.appendChild(cell);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  element.replaceWith(table);
}
