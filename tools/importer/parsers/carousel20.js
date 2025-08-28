/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row - exact match
  const headerRow = ['Carousel (carousel20)'];

  // Get slide image
  const imgContainer = element.querySelector('.slider--img-container');
  let imgSrc = '';
  let imgAlt = '';
  let imgEl = null;
  if (imgContainer) {
    const bgDiv = imgContainer.querySelector('.slider-img');
    if (bgDiv) {
      imgSrc = bgDiv.getAttribute('data-bg-image') || '';
      imgAlt = bgDiv.getAttribute('title') || '';
      if (imgSrc) {
        imgEl = document.createElement('img');
        imgEl.src = imgSrc;
        imgEl.alt = imgAlt || '';
      }
    }
  }

  // Get slide text content
  let textElements = [];
  if (imgContainer) {
    // Heading: must retain heading level and semantic meaning
    const headingContainer = imgContainer.querySelector('.slider-heading');
    if (headingContainer) {
      const heading = headingContainer.querySelector('.slider-heading--location');
      if (heading && heading.textContent.trim()) {
        // reference only text
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        textElements.push(h2);
      }
      // If there's a tag or description, include it
      const tag = headingContainer.querySelector('.slider-heading--tag');
      if (tag && tag.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = tag.textContent.trim();
        textElements.push(p);
      }
    }
    // Photo credits - semantic meaning is a plain paragraph
    const creditContainer = imgContainer.querySelector('.slider--credit-container');
    if (creditContainer) {
      const creditText = creditContainer.querySelector('.slider--credit-text');
      if (creditText && creditText.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = creditText.textContent.trim();
        textElements.push(p);
      }
    }
  }

  // If there is no text content, cell should be an empty array
  const textCell = textElements.length > 0 ? textElements : [''];

  // Compose table cells, matching 2 columns (image, text)
  const cells = [
    headerRow,
    [imgEl, textCell]
  ];

  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
