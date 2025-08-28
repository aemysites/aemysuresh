/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns18)'];

  // Gather references to the three major columns:
  // 1. Logo
  // 2. Navigation
  // 3. Login/CTA

  // 1. Logo
  const logo = element.querySelector('.headerv2__logo');
  // 2. Navigation
  const nav = element.querySelector('nav.headerv2__navbar');
  // 3. Login/CTA
  const login = element.querySelector('.headerv2__login');

  // Defensive: If any are missing, substitute an empty div, to preserve column count
  const logoCol = logo || document.createElement('div');
  const navCol = nav || document.createElement('div');
  const loginCol = login || document.createElement('div');

  // Create table row for columns
  const columnsRow = [logoCol, navCol, loginCol];

  // Compose table
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}