/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches example exactly
  const headerRow = ['Carousel (carousel21)'];

  // Slide row: [image, text content]
  // Extract image
  let imgEl = null;
  const imgDiv = element.querySelector('.slider-img');
  if (imgDiv) {
    const imgSrc = imgDiv.getAttribute('data-bg-image');
    if (imgSrc) {
      imgEl = document.createElement('img');
      imgEl.src = imgSrc;
      imgEl.alt = '';
    }
  }

  // Extract text content (title, credit)
  const textFragments = [];
  const headingContainer = element.querySelector('.slider-heading');
  let titleEl = null;
  if (headingContainer) {
    // Use existing h2 as heading
    titleEl = headingContainer.querySelector('h2');
    if (titleEl) {
      textFragments.push(titleEl);
    }
    // If there's a tag, and it's not empty, include it
    const tagEl = headingContainer.querySelector('.slider-heading--tag');
    if (tagEl && tagEl.textContent.trim()) {
      textFragments.push(tagEl);
    }
  }

  // Photo credits
  const creditContainer = element.querySelector('.slider--credit-container');
  if (creditContainer) {
    const creditTextEl = creditContainer.querySelector('.slider--credit-text');
    if (creditTextEl && creditTextEl.textContent.trim()) {
      // Add a <br> for spacing before credit
      textFragments.push(document.createElement('br'));
      textFragments.push(creditTextEl);
    }
  }

  // Compose table rows
  const cells = [
    headerRow,
    [imgEl, textFragments]
  ];

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}