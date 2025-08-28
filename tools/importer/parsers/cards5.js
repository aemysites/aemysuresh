/* global WebImporter */
export default function parse(element, { document }) {
  // Get all the cards
  const slideCards = Array.from(element.querySelectorAll('.swiper-slide .image-carousel--card'));

  // Build table header
  const cells = [
    ['Cards (cards5)'],
  ];

  slideCards.forEach(card => {
    // Image
    const img = card.querySelector('.image-carousel--img-container img');

    // Title (bold)
    const titleDiv = card.querySelector('.image-carousel--content-container .title');
    let titleEl = null;
    if (titleDiv && titleDiv.textContent.trim()) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleDiv.textContent.trim();
    }

    // Description: in this HTML, if there is a paragraph, span, or any sibling under content-container
    let descEls = [];
    const contentCont = card.querySelector('.image-carousel--content-container');
    if (contentCont) {
      // Get all elements except the title
      descEls = Array.from(contentCont.childNodes).filter(node => {
        // Only keep element nodes or text nodes that are not pure whitespace
        if (node === titleDiv) return false;
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
        return false;
      });
    }

    // Compose text cell: title on top, description(s) below
    const cell2 = [];
    if (titleEl) cell2.push(titleEl);
    if (descEls.length > 0) {
      // If there are descriptive elements or text, add them below title
      descEls.forEach(el => cell2.push(el));
    }
    // If only title, cell2 is [title], else [title, ...description]
    cells.push([img, cell2.length ? cell2 : '']);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
