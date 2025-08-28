/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header matches example
  const headerRow = ['Hero (hero4)'];

  // --- Background Image Row ---
  // Find the background image element, use src attribute
  let backgroundImageRow = [''];
  const imgDiv = element.querySelector('.slider-img');
  if (imgDiv && imgDiv.dataset.bgImage) {
    // Create an <img> element using src from data-bg-image
    const imgEl = document.createElement('img');
    imgEl.src = imgDiv.dataset.bgImage;
    imgEl.title = imgDiv.title || '';
    backgroundImageRow = [imgEl];
  }

  // --- Content/Text Row ---
  // Gather heading, (optional) tag, and photo credit as in the source HTML
  const contentElements = [];

  // Heading (always present in this HTML)
  const headingContainer = element.querySelector('.slider-heading');
  if (headingContainer) {
    const titleEl = headingContainer.querySelector('.slider-heading--location');
    if (titleEl && titleEl.textContent.trim()) {
      contentElements.push(titleEl);
    }
    // Subheading/tag (optional, but empty string in provided HTML)
    const tagEl = headingContainer.querySelector('.slider-heading--tag');
    if (tagEl && tagEl.textContent.trim()) {
      contentElements.push(tagEl);
    }
  }

  // Photo credit
  const creditContainer = element.querySelector('.slider--credit-container');
  if (creditContainer) {
    const creditTextEl = creditContainer.querySelector('.slider--credit-text');
    if (creditTextEl && creditTextEl.textContent.trim()) {
      contentElements.push(creditTextEl);
    }
  }

  // Content row is a single cell with all content elements
  const contentRow = [contentElements];

  // Compose the cells per spec: header, bg image, content
  const cells = [headerRow, backgroundImageRow, contentRow];

  // Create table and replace original element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
