/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Get all tab links
  const tabLinks = Array.from(tabsContainer.querySelectorAll('a.tab'));
  if (!tabLinks.length) return;

  // Table header
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // Each tab: label and content (content is omitted if not present)
  tabLinks.forEach(tab => {
    const tabLabel = tab.textContent.trim();
    // Only add row if tabLabel is present
    if (tabLabel) {
      rows.push([tabLabel]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
