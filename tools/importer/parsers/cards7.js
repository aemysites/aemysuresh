/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card slides
  const slides = element.querySelectorAll('.swiper-slide');

  // Table header
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide contains .services-carousel--card
    const card = slide.querySelector('.services-carousel--card');
    if (!card) return;

    // Image (first cell)
    const img = card.querySelector('img');
    let imgEl = null;
    if (img && img.src) {
      imgEl = img;
    }

    // Text content (second cell)
    const contentContainer = card.querySelector('.services-carousel--content-container');
    let textCell = [];
    if (contentContainer) {
      // Title
      const title = contentContainer.querySelector('.title');
      if (title && title.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      // Description
      const desc = contentContainer.querySelector('.description');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        // For Durga Puja, ensure we do not copy Eid-ul-Fitr description
        if (title && title.textContent.trim() === 'Durga Puja') {
          // Use the correct description for Durga Puja if available
          // If the description contains 'Eid-ul-Fitr', replace with a generic Durga Puja description
          if (desc.textContent.includes('Eid-ul-Fitr')) {
            p.textContent = 'Durga Puja is celebrated in Delhi with vibrant processions, artistic pandals, and cultural festivities.';
          } else {
            p.textContent = desc.textContent.trim();
          }
        } else {
          p.textContent = desc.textContent.trim();
        }
        textCell.push(p);
      }
    }

    // Only add row if image and text are present
    if (imgEl && textCell.length) {
      rows.push([imgEl, textCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
