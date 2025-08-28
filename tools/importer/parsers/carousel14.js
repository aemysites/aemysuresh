/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row matching example
  const headerRow = ['Carousel (carousel14)'];

  // Find image URL from .slider-img[data-bg-image] or background-image style
  const imgContainer = element.querySelector('.slider--img-container');
  const sliderImg = imgContainer ? imgContainer.querySelector('.slider-img') : null;

  let imgUrl = '';
  if (sliderImg) {
    imgUrl = sliderImg.getAttribute('data-bg-image') || '';
    if (!imgUrl && sliderImg.style && sliderImg.style.backgroundImage) {
      // Try to extract from backgroundImage style string
      const match = sliderImg.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (match && match[1]) {
        imgUrl = match[1];
      }
    }
  }

  let imageEl = null;
  if (imgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imgUrl;
    imageEl.alt = '';
  }

  // Second cell: text content
  const textContent = [];

  // Title - use heading from .slider-heading--location
  const headingDiv = imgContainer ? imgContainer.querySelector('.slider-heading') : null;
  const heading = headingDiv ? headingDiv.querySelector('.slider-heading--location') : null;
  if (heading && heading.textContent.trim()) {
    // Reference heading element directly
    textContent.push(heading);
  }

  // Description/tag - (if any text in .slider-heading--tag)
  const tagSpan = headingDiv ? headingDiv.querySelector('.slider-heading--tag') : null;
  if (tagSpan && tagSpan.textContent.trim()) {
    textContent.push(tagSpan);
  }

  // Photo credits (if any)
  const creditTextDiv = imgContainer ? imgContainer.querySelector('.slider--credit-text') : null;
  if (creditTextDiv && creditTextDiv.textContent.trim()) {
    textContent.push(creditTextDiv);
  }

  // Compose table
  const cells = [
    headerRow,
    [imageEl, textContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
