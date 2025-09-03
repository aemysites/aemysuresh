/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel wrapper containing all slides
  const carouselWrapper = element.querySelector('.carousel__wrapper');
  if (!carouselWrapper) return;

  // Get all slide anchors (each slide is an <a> element)
  const slides = Array.from(carouselWrapper.children).filter(child => child.classList.contains('carousel__slide'));

  // Table header as specified
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];

  slides.forEach(slide => {
    // Find the image for the slide
    let imgEl = null;
    const picture = slide.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
    if (!imgEl) return;

    // Extract all visible text from the slide (including nested elements)
    const textCell = document.createElement('div');
    const slideClone = slide.cloneNode(true);
    Array.from(slideClone.querySelectorAll('img')).forEach(img => img.remove());
    Array.from(slideClone.querySelectorAll('picture')).forEach(pic => pic.remove());
    Array.from(slideClone.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        textCell.appendChild(node.cloneNode(true));
      } else if (node.nodeType === Node.TEXT_NODE) {
        textCell.appendChild(document.createTextNode(node.textContent));
      }
    });
    // Only include second column if there is actual text content, otherwise omit
    if (textCell.textContent.trim()) {
      rows.push([imgEl, textCell]);
    } else {
      rows.push([imgEl, '']);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
