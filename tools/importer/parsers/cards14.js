/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per instructions and example
  const rows = [["Cards (cards14)"]];

  // Select all cards (links as direct children)
  const cards = element.querySelectorAll('a.swiper-slide');
  cards.forEach((card) => {
    // FIRST CELL: Icon (span), or null if not present
    const icon = card.querySelector('.swiper-slide__flight-icon');

    // SECOND CELL: Text content - preserve all p's in order, and add a CTA link at the end
    const textCellContent = [];
    // Get all p tags inside card in order (title and desc)
    const ps = card.querySelectorAll('p');
    ps.forEach((p) => {
      textCellContent.push(p);
    });

    // Add CTA link to the end if href exists (use existing card href)
    if (card.href) {
      const cta = document.createElement('a');
      cta.href = card.href;
      cta.textContent = 'Learn more';
      // copy target if present
      if (card.target) cta.target = card.target;
      textCellContent.push(cta);
    }

    // Add row: icon (may be null), text content array
    rows.push([icon, textCellContent]);
  });

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
