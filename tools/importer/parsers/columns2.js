/* global WebImporter */
export default function parse(element, { document }) {
  // Get the immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const numColumns = columns.length;

  // Build table manually for correct colspan handling
  const table = document.createElement('table');

  // Create header row with one <th> with correct colspan
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns2)';
  if (numColumns > 1) th.setAttribute('colspan', numColumns);
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  // Create data row with each column content as a cell
  const row = document.createElement('tr');
  columns.forEach(col => {
    const td = document.createElement('td');
    td.appendChild(col);
    row.appendChild(td);
  });
  table.appendChild(row);

  element.replaceWith(table);
}
