/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards9)'];

  // Find all card slides
  const slides = element.querySelectorAll('.swiper-slide');
  const rows = [];

  slides.forEach((slide) => {
    // Find the image in the card
    const img = slide.querySelector('.image-carousel--img-container img');
    // Find the card content container
    const contentContainer = slide.querySelector('.image-carousel--content-container');
    let textCellContent = [];

    // Title (always expected)
    const titleDiv = contentContainer ? contentContainer.querySelector('.title') : null;
    if (titleDiv) {
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      textCellContent.push(strong);
    }

    // Description (optional, below title)
    // Select any text nodes or elements inside contentContainer that are not the title
    if (contentContainer) {
      Array.from(contentContainer.childNodes).forEach(node => {
        if (node !== titleDiv && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // If there is a text node after the title
          const desc = document.createElement('p');
          desc.textContent = node.textContent.trim();
          textCellContent.push(desc);
        } else if (node !== titleDiv && node.nodeType === Node.ELEMENT_NODE) {
          // If there are other description elements
          textCellContent.push(node);
        }
      });
    }

    // If nothing found for text cell, fallback to empty string
    const textCell = textCellContent.length ? (textCellContent.length === 1 ? textCellContent[0] : textCellContent) : '';

    rows.push([img, textCell]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
