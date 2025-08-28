/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as in example
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Get all cards: both main and extra
  const cardDivs = [
    ...element.querySelectorAll('.card-container > .card-main-container > .card'),
    ...element.querySelectorAll('.card-extra-container > .card')
  ];

  // Utility to create the card text content cell
  function createTextCell(details, ribbon) {
    const cell = document.createElement('div');
    // Title (always present)
    const titleEl = details.querySelector('.card--title');
    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      cell.appendChild(strong);
    }
    // Description (optional)
    const descEl = details.querySelector('.card--description');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      cell.appendChild(p);
    }
    // Info (always present)
    const infoEl = details.querySelector('.card--info');
    if (infoEl) {
      const span = document.createElement('span');
      span.textContent = infoEl.textContent.trim();
      cell.appendChild(span);
    }
    // Ribbon (optional, eg. 'Trending')
    if (ribbon) {
      const rib = document.createElement('span');
      rib.textContent = ribbon.textContent.trim();
      rib.className = 'ribbon';
      cell.appendChild(rib);
    }
    return cell;
  }

  // Iterate each card to build rows
  cardDivs.forEach(cardDiv => {
    const img = cardDiv.querySelector('img'); // always present
    const details = cardDiv.querySelector('.card--details');
    const ribbon = cardDiv.querySelector('.ribbon');
    if (img && details) {
      rows.push([
        img,
        createTextCell(details, ribbon)
      ]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
