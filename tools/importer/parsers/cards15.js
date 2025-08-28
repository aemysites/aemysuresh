/* global WebImporter */
export default function parse(element, { document }) {
  // Build the block table header
  const cells = [['Cards (cards15)']];

  // Find the card container
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  // Each card is an <a> child of wrapper
  const cards = Array.from(wrapper.children).filter(el => el.tagName.toLowerCase() === 'a');

  cards.forEach(card => {
    // FIRST CELL: icon or image (always use the span.icon if present)
    let icon = card.querySelector('span.swiper-slide__flight-icon');
    if (!icon) {
      // fallback: empty span for structure
      icon = document.createElement('span');
    }
    // Reference the actual element, do not clone

    // SECOND CELL: all text (title + description + optional CTA)
    // We want to preserve all text content and reference actual nodes
    // Title is usually the first <p> in the card
    const titleP = card.querySelector('.swiper-slide__main, p');
    // Description is the next <p> in .swiper-slide__text
    const descP = card.querySelector('.swiper-slide__text p');
    // CTA is present in the form of the card's href
    const textFragments = [];
    // Strong for title
    if (titleP && titleP.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleP.textContent.trim();
      textFragments.push(strong);
    }
    // Description
    if (descP && descP.textContent.trim()) {
      textFragments.push(document.createElement('br'));
      const descSpan = document.createElement('span');
      descSpan.textContent = descP.textContent.trim();
      textFragments.push(descSpan);
    }
    // CTA (optional): Only if card has a non-empty, non-# href
    const href = card.getAttribute('href');
    if (href && href !== '#' && href !== '') {
      textFragments.push(document.createElement('br'));
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Learn more';
      textFragments.push(link);
    }
    // Build the row: [icon, all text content]
    cells.push([
      icon,
      textFragments
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
