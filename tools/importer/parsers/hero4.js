/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly
  const headerRow = ['Hero (hero4)'];

  // Row 2: background image (single img element)
  let bgImg = '';
  const imgDiv = element.querySelector('.slider-img[data-bg-image]');
  if (imgDiv) {
    const imgUrl = imgDiv.getAttribute('data-bg-image');
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = imgDiv.getAttribute('title') || '';
      bgImg = img;
    }
  }
  const bgImgRow = [bgImg];

  // Row 3: heading and text content
  const cellContent = [];

  // Heading: .slider-heading--location (h2)
  const heading = element.querySelector('.slider-heading--location');
  if (heading) {
    // Use the actual <h2> element from the document for correct heading level
    cellContent.push(heading);
  }

  // Subheading/credit: .slider--credit-text (div)
  const credit = element.querySelector('.slider--credit-text');
  if (credit) {
    cellContent.push(credit);
  }

  // If there is a tag/span for subheading (not in this HTML, but possible)
  const subheading = element.querySelector('.slider-heading--tag');
  if (subheading && subheading.textContent.trim()) {
    cellContent.push(subheading);
  }

  // Compose content row
  const contentRow = [cellContent.length ? cellContent : ''];

  // Build table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
