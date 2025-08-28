/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the example
  const headerRow = ['Cards (cardsNoImages16)'];
  const cells = [headerRow];

  // Find the swiper-wrapper containing cards
  const wrapper = element.querySelector('.swiper-wrapper');
  if (wrapper) {
    // Each direct child <a> is a card
    const cards = Array.from(wrapper.children).filter(el => el.classList.contains('swiper-slide'));
    cards.forEach(card => {
      const cardContent = [];

      // Card heading: first <p> in hierarchy under this card
      const heading = card.querySelector('.swiper-slide__main, .slider-heading-text');
      if (heading && heading.textContent.trim().length > 0) {
        cardContent.push(heading);
      }

      // Card description: usually <div> with class swiper-slide__text, or fallback to next <p>
      const desc = card.querySelector('.swiper-slide__text p');
      if (desc && desc.textContent.trim().length > 0) {
        cardContent.push(desc);
      }

      // If for some reason above selectors miss any <p>s, add ALL <p> that is not already in cardContent
      const allPs = card.querySelectorAll('p');
      allPs.forEach(p => {
        if (!cardContent.includes(p) && p.textContent.trim().length > 0) {
          cardContent.push(p);
        }
      });

      // CTA: if the card is a link, add it as a CTA at the bottom
      if (card.hasAttribute('href')) {
        const link = document.createElement('a');
        link.href = card.getAttribute('href');
        link.target = card.getAttribute('target') || '_self';
        link.textContent = 'Learn more';
        cardContent.push(link);
      }

      // Add only if cardContent has something
      if (cardContent.length > 0) {
        cells.push([cardContent]);
      }
    });
  }

  // Replace with the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
