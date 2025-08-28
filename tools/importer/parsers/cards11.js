/* global WebImporter */
export default function parse(element, { document }) {
  // Find all the card elements (main + extra)
  const mainCards = Array.from(element.querySelectorAll('.card-main-container .card'));
  const extraCards = Array.from(element.querySelectorAll('.card-extra-container .card'));
  const cards = [...mainCards, ...extraCards];

  // Table header row exactly as specified
  const cells = [['Cards (cards11)']];

  // For each card, build a row [image, text content]
  cards.forEach(card => {
    // Get the image element (must reference the existing node)
    const img = card.querySelector('img');

    // Get card details containing the title, description, and info
    const details = card.querySelector('.card--details');

    // Compose content cell: title (strong), description (p), info (span), ribbon (em, if present)
    const contentParts = [];

    // Title (display as <strong>)
    const title = details.querySelector('.card--title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      contentParts.push(strong);
    }

    // Description (<p>) if present
    const desc = details.querySelector('.card--description');
    if (desc) {
      // Use the real element
      contentParts.push(document.createElement('br'));
      contentParts.push(desc);
    }

    // Info (span) if present
    const info = details.querySelector('.card--info');
    if (info) {
      contentParts.push(document.createElement('br'));
      contentParts.push(info);
    }

    // Ribbon/marker if present
    const ribbon = card.querySelector('.ribbon');
    if (ribbon) {
      contentParts.push(document.createElement('br'));
      const em = document.createElement('em');
      em.textContent = ribbon.textContent;
      contentParts.push(em);
    }

    // Push the row: [image, [content parts]]
    cells.push([img, contentParts]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
