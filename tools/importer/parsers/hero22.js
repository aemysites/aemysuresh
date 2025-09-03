/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as per block requirements
  const headerRow = ['Hero (hero22)'];

  // Row 2: Background image (optional)
  // There is no image in the provided HTML, so this row will be empty
  const imageRow = [''];

  // Row 3: Title, subheading, CTA (optional)
  // Extract all text content except the skip link
  let content = '';
  // Get all text content from the element, excluding the skip link
  Array.from(element.querySelectorAll('*')).forEach((node) => {
    if (
      node.id === 'skipContent' ||
      (node.textContent && node.textContent.trim().toLowerCase() === 'skip to main content')
    ) {
      return;
    }
    if (node.textContent && node.textContent.trim()) {
      content += node.textContent.trim() + '\n';
    }
  });
  // Also check for direct text nodes under the element (not wrapped in a child)
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
      content += node.textContent.trim() + '\n';
    }
  });
  content = content.trim();
  const contentRow = [content ? content : ''];

  // Compose table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
