/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (1 column)
  const headerRow = ['Carousel (carousel11)'];

  // Find the image url
  let imgEl = null;
  const imgContainer = element.querySelector('.slider--img-container');
  if (imgContainer) {
    const sliderImg = imgContainer.querySelector('.slider-img');
    if (sliderImg && sliderImg.dataset && sliderImg.dataset.bgImage) {
      imgEl = document.createElement('img');
      imgEl.src = sliderImg.dataset.bgImage;
      imgEl.alt = '';
    }
  }

  // Extract title and credits
  let heading = null;
  if (imgContainer) {
    const sliderHeading = imgContainer.querySelector('.slider-heading');
    if (sliderHeading) {
      const h2 = sliderHeading.querySelector('.slider-heading--location');
      if (h2 && h2.textContent.trim()) {
        heading = document.createElement('h2');
        heading.textContent = h2.textContent.trim();
      }
    }
  }
  let credit = null;
  if (imgContainer) {
    const creditContainer = imgContainer.querySelector('.slider--credit-container');
    if (creditContainer) {
      const creditText = creditContainer.querySelector('.slider--credit-text');
      if (creditText && creditText.textContent.trim()) {
        credit = document.createElement('div');
        credit.textContent = creditText.textContent.trim();
      }
    }
  }
  // Compose text cell
  const textCell = [];
  if (heading) textCell.push(heading);
  if (credit) textCell.push(credit);

  // The first row is the header (1 column); the rest are 2 columns per slide as in the example
  const rows = [
    headerRow,
    [imgEl, textCell]
  ];

  // Create the table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
