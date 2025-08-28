/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header: exact match
  const headerRow = ['Carousel (carousel20)'];

  // 2. Build content rows
  // Find the image from .slider-img background
  let imgUrl = '';
  const imgDiv = element.querySelector('.slider--img-container .slider-img');
  if (imgDiv && imgDiv.style.backgroundImage) {
    // Extract url from: background-image: url("...")
    const m = imgDiv.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
    if (m) imgUrl = m[1];
  }
  let imageEl = null;
  if (imgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imgUrl;
    imageEl.alt = '';
  }

  // Text column: collect heading (if present), then credit (if present)
  const textNodes = [];
  // Heading (if present)
  const location = element.querySelector('.slider-heading--location');
  if (location && location.textContent.trim()) {
    // Use an <h2> as in the original
    textNodes.push(location);
  }

  // Credit (optional)
  const credit = element.querySelector('.slider--credit-text');
  if (credit && credit.textContent.trim()) {
    // Use the existing element
    textNodes.push(credit);
  }

  // Compose the table rows: image in col0, text (if any) in col1 (else empty string)
  const row = [imageEl, textNodes.length > 0 ? textNodes : ''];
  const cells = [headerRow, row];

  // 3. Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace original element
  element.replaceWith(table);
}
