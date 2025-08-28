/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards11)'];

  // Gather all card nodes (main + extra)
  const cardNodes = [
    ...element.querySelectorAll('.card-main-container .card'),
    ...element.querySelectorAll('.card-extra-container .card')
  ];

  // Helper to build the text cell, preserving semantic structure
  function buildTextCell(card) {
    const details = card.querySelector('.card--details');
    // Title (h2) as <strong>
    let titleEl = null;
    const title = details?.querySelector('.card--title');
    if (title) {
      titleEl = document.createElement('strong');
      titleEl.textContent = title.textContent.trim();
    }
    // Description (may be missing)
    let descEl = null;
    const desc = details?.querySelector('.card--description');
    if (desc) {
      descEl = document.createElement('span');
      descEl.textContent = desc.textContent.trim();
    }
    // Info (may be missing)
    let infoEl = null;
    const info = details?.querySelector('.card--info');
    if (info) {
      infoEl = document.createElement('span');
      infoEl.textContent = info.textContent.trim();
      infoEl.style.display = 'block';
    }
    // Marker/ribbon (may be missing)
    let markerEl = null;
    const ribbon = card.querySelector('.ribbon');
    if (ribbon) {
      markerEl = document.createElement('em');
      markerEl.textContent = ribbon.textContent.trim();
      markerEl.style.display = 'block';
    }
    // Compose cell, using array so createTable does not wrap in <span>
    const cellContent = [];
    if (titleEl) cellContent.push(titleEl);
    if (descEl) {
      if (cellContent.length) cellContent.push(document.createElement('br'));
      cellContent.push(descEl);
    }
    if (infoEl) {
      if (cellContent.length) cellContent.push(document.createElement('br'));
      cellContent.push(infoEl);
    }
    if (markerEl) {
      if (cellContent.length) cellContent.push(document.createElement('br'));
      cellContent.push(markerEl);
    }
    return cellContent;
  }

  // Build all table rows (one per card)
  const rows = cardNodes.map(card => {
    // Image element, reference as-is
    const img = card.querySelector('img');
    // Text cell content
    const textCell = buildTextCell(card);
    return [img, textCell];
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
