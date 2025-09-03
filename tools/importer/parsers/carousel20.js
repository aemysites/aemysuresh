/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create an <img> from background-image style
  function createImgFromBg(div) {
    const bg = div.getAttribute('data-bg-image') || '';
    if (!bg) return null;
    const img = document.createElement('img');
    img.src = bg;
    img.alt = div.getAttribute('title') || '';
    return img;
  }

  // Get the image container
  const imgContainer = element.querySelector('.slider--img-container');
  let imageDiv = null;
  if (imgContainer) {
    imageDiv = imgContainer.querySelector('.slider-img');
  }
  const imgEl = imageDiv ? createImgFromBg(imageDiv) : null;

  // Get the heading/title
  let heading = null;
  if (imgContainer) {
    const headingDiv = imgContainer.querySelector('.slider-heading');
    if (headingDiv) {
      const h2 = headingDiv.querySelector('.slider-heading--location');
      if (h2 && h2.textContent.trim()) {
        heading = document.createElement('h2');
        heading.textContent = h2.textContent.trim();
      }
    }
  }

  // Get the photo credit
  let credit = null;
  if (imgContainer) {
    const creditDiv = imgContainer.querySelector('.slider--credit-text');
    if (creditDiv && creditDiv.textContent.trim()) {
      credit = document.createElement('div');
      credit.textContent = creditDiv.textContent.trim();
      credit.style.marginTop = '1em';
    }
  }

  // Compose the text cell
  const textCellContent = [];
  if (heading) textCellContent.push(heading);
  if (credit) textCellContent.push(credit);

  // Table header
  const headerRow = ['Carousel (carousel20)'];
  // Table row for this slide
  const slideRow = [imgEl, textCellContent];

  // Build table
  const cells = [headerRow, slideRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
