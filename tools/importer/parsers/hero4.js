/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from style attribute
  function extractBgUrl(style) {
    if (!style) return '';
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    return match ? match[1] : '';
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row
  // Find the background image div
  const imgContainer = element.querySelector('.slider--img-container');
  let bgDiv = null;
  if (imgContainer) {
    bgDiv = imgContainer.querySelector('.slider-img');
  }
  let bgImgUrl = '';
  if (bgDiv) {
    bgImgUrl = extractBgUrl(bgDiv.getAttribute('style')) || bgDiv.getAttribute('data-bg-image') || '';
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = bgDiv && bgDiv.getAttribute('title') ? bgDiv.getAttribute('title') : '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (title, subheading, CTA, credits)
  // Title
  let titleEl = null;
  if (imgContainer) {
    const headingDiv = imgContainer.querySelector('.slider-heading');
    if (headingDiv) {
      const h2 = headingDiv.querySelector('.slider-heading--location');
      if (h2) {
        // Use h2 as heading
        titleEl = document.createElement('h1');
        titleEl.textContent = h2.textContent;
      }
    }
  }
  // Subheading (none in this HTML)
  // CTA (none in this HTML)
  // Credits
  let creditsEl = null;
  if (imgContainer) {
    const creditContainer = imgContainer.querySelector('.slider--credit-container');
    if (creditContainer) {
      const creditText = creditContainer.querySelector('.slider--credit-text');
      if (creditText) {
        creditsEl = document.createElement('div');
        creditsEl.textContent = creditText.textContent;
      }
    }
  }
  // Compose content cell
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (creditsEl) contentCell.push(creditsEl);
  const contentRow = [contentCell];

  // Compose table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
