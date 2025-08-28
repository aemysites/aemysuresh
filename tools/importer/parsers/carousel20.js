/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Carousel (carousel20)'];

  // Helper to extract image
  let imageEl = null;
  const imgDiv = element.querySelector('.slider-img');
  if (imgDiv && imgDiv.getAttribute('data-bg-image')) {
    imageEl = document.createElement('img');
    imageEl.src = imgDiv.getAttribute('data-bg-image');
    imageEl.alt = '';
  }

  // Text content cell
  const textCell = [];
  const sliderHeading = element.querySelector('.slider-heading');
  if (sliderHeading) {
    const heading = sliderHeading.querySelector('.slider-heading--location');
    if (heading && heading.textContent.trim()) {
      // Use existing element if possible
      textCell.push(heading);
    }
    // If there is a tag (not used here, but included for general cases)
    const tag = sliderHeading.querySelector('.slider-heading--tag');
    if (tag && tag.textContent.trim()) {
      textCell.push(tag);
    }
  }
  // Photo credit, if present
  const creditContainer = element.querySelector('.slider--credit-container');
  if (creditContainer) {
    const creditText = creditContainer.querySelector('.slider--credit-text');
    if (creditText && creditText.textContent.trim()) {
      textCell.push(creditText);
    }
  }
  // Compose rows
  const row = [imageEl, textCell];
  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
