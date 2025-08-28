/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Carousel (carousel9)'];

  // 2. Find the slider image
  const sliderImgDiv = element.querySelector('.slider-img');
  let imageUrl = sliderImgDiv && sliderImgDiv.getAttribute('data-bg-image');
  let imageEl = null;
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.setAttribute('loading', 'lazy');
    // Width/height not set in HTML, so not set here
  }

  // 3. Extract title (location)
  let titleEl = null;
  const headingContainer = element.querySelector('.slider-heading');
  if (headingContainer) {
    const locationEl = headingContainer.querySelector('.slider-heading--location');
    if (locationEl && locationEl.textContent.trim()) {
      titleEl = document.createElement('h2');
      // Use textContent, preserve semantic heading
      titleEl.textContent = locationEl.textContent.trim();
    }
  }

  // 4. Extract photo credits (description)
  let creditEl = null;
  const creditTextEl = element.querySelector('.slider--credit-text');
  if (creditTextEl && creditTextEl.textContent.trim()) {
    creditEl = document.createElement('p');
    creditEl.textContent = creditTextEl.textContent.trim();
  }

  // 5. Compose text cell
  const textCellContent = [];
  if (titleEl) textCellContent.push(titleEl);
  if (creditEl) textCellContent.push(creditEl);

  // 6. Build final table
  // Each slide is a row: first cell image, second cell text (title + description)
  const rows = [
    headerRow,
    [imageEl, textCellContent]
  ];

  // 7. Replace the element with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}