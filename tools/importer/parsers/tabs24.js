/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Get all tab links
  const tabLinks = Array.from(tabsContainer.querySelectorAll('a.tab'));
  if (!tabLinks.length) return;

  // Header row: block name only, one column
  const headerRow = ['Tabs (tabs24)'];

  // Each tab label goes in its own row, two columns: label and empty string for content
  const rows = tabLinks.map(tab => [tab.textContent.trim(), '']);

  // Build table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
