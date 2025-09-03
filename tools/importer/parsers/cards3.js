/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main image inside the block
  const img = element.querySelector('img');
  if (!img) return;

  // Use the block name as the header row (single column)
  const headerRow = ['Cards (cards3)'];

  // Create a div to hold all card details as proper HTML (no markdown)
  const cardDetailsDiv = document.createElement('div');

  // Add each card detail as a separate block element
  const details = [
    ['2,300+', 'Daily Flights'],
    ['90+', 'Domestic Destinations'],
    ['40+', 'International Destinations'],
    ['750 Mn+', 'Happy Customers'],
    ['400+', 'Fleet Strong'],
  ];

  details.forEach(([title, desc]) => {
    const wrapper = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = title;
    wrapper.appendChild(strong);
    wrapper.appendChild(document.createTextNode(' ' + desc));
    cardDetailsDiv.appendChild(wrapper);
  });

  // Build the card row: image in first cell, all text in second cell
  const cardRow = [img, cardDetailsDiv];

  // Build the table: header row, then card row (2 columns)
  const cells = [headerRow, cardRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
