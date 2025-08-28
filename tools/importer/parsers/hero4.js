/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero4)'];

  // --- IMAGE ROW ---
  // Find the background image URL
  let imageElem = null;
  const sliderImg = element.querySelector('.slider-img');
  if (sliderImg) {
    const bgUrl = sliderImg.getAttribute('data-bg-image');
    if (bgUrl) {
      imageElem = document.createElement('img');
      imageElem.src = bgUrl;
      imageElem.alt = sliderImg.title || '';
      if (sliderImg.title) imageElem.title = sliderImg.title;
    }
  }
  const imageRow = [imageElem || ''];

  // --- CONTENT ROW ---
  // Compose all content elements (heading, subheading, credit)
  const contentElems = [];
  // Heading (h2)
  const sliderHeading = element.querySelector('.slider-heading');
  if (sliderHeading) {
    const heading = sliderHeading.querySelector('h2');
    if (heading && heading.textContent.trim()) contentElems.push(heading);
    // Subheading (tag) - only if it contains text
    const subheading = sliderHeading.querySelector('.slider-heading--tag');
    if (subheading && subheading.textContent.trim()) contentElems.push(subheading);
  }
  // Photo credit (optional)
  const credit = element.querySelector('.slider--credit-text');
  if (credit && credit.textContent.trim()) contentElems.push(credit);

  // If there are no content elements, ensure cell is not empty string (use '')
  const contentRow = [contentElems.length ? contentElems : ''];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
