/* global WebImporter */
export default function parse(element, { document }) {
  // Find the swiper wrapper containing the cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all card anchor elements (each card is an <a> inside .swiper-wrapper)
  const cardEls = Array.from(swiperWrapper.querySelectorAll('a.swiper-slide'));

  // Table header row
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // For each card, build a row: [icon, text content]
  cardEls.forEach((card) => {
    // Defensive: find the icon span (first cell)
    let iconSpan = card.querySelector('.swiper-slide__flight-icon');
    // If not found, fallback to any span with icon class
    if (!iconSpan) {
      iconSpan = card.querySelector('span');
    }

    // Compose text content (second cell)
    const textContent = document.createElement('div');
    // Title
    const title = card.querySelector('.swiper-slide__main');
    if (title) {
      // Clone to avoid removing from source
      textContent.appendChild(title.cloneNode(true));
    }
    // Description: get all <p> inside .swiper-slide__text
    const descPs = card.querySelectorAll('.swiper-slide__text p');
    descPs.forEach((desc) => {
      textContent.appendChild(desc.cloneNode(true));
    });
    // Call-to-action: use the card's href as a link if present
    if (card.href) {
      const link = document.createElement('a');
      link.href = card.href;
      link.textContent = 'Learn more';
      link.target = card.target || '_self';
      textContent.appendChild(link);
    }

    // Add row: [icon, textContent]
    rows.push([iconSpan ? iconSpan.cloneNode(true) : '', textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
