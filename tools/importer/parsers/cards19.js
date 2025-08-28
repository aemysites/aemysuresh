/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards19)'];
  const cells = [headerRow];

  // Gather all card elements
  const cardElems = [
    ...element.querySelectorAll('.card-main-container .card'),
    ...element.querySelectorAll('.card-extra-container .card')
  ];

  cardElems.forEach(card => {
    // Image (first cell)
    const img = card.querySelector('img');

    // Text (second cell)
    const details = card.querySelector('.card--details');
    const textContent = [];

    // Title (heading)
    const title = details && details.querySelector('.card--title');
    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title.textContent;
      textContent.push(heading);
    }

    // Description (optional)
    const description = details && details.querySelector('.card--description');
    if (description && description.textContent.trim()) {
      textContent.push(document.createElement('br'));
      textContent.push(document.createTextNode(description.textContent));
    }

    // Exploration time info
    const info = details && details.querySelector('.card--info');
    if (info && info.textContent.trim()) {
      textContent.push(document.createElement('br'));
      textContent.push(document.createElement('br'));
      textContent.push(document.createTextNode(info.textContent));
    }

    // Ribbon/marker (optional)
    const ribbon = card.querySelector('.ribbon');
    if (ribbon && ribbon.textContent.trim()) {
      textContent.push(document.createElement('br'));
      textContent.push(document.createElement('br'));
      const ribbonElem = document.createElement('span');
      ribbonElem.textContent = ribbon.textContent;
      ribbonElem.style.fontWeight = 'bold';
      textContent.push(ribbonElem);
    }

    // Add row with [img, textContent]
    cells.push([img, textContent]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}