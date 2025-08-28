/* global WebImporter */
export default function parse(element, { document }) {
  // Set up header
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Find the swiper-wrapper containing cards
  const slidesWrapper = element.querySelector('.swiper-wrapper');
  if (!slidesWrapper) {
    // No slides, replace element with just the header row table to avoid crashing
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
    return;
  }

  const slides = Array.from(slidesWrapper.children).filter((child) => child.classList.contains('swiper-slide'));

  slides.forEach((slide) => {
    // Each slide has .services-carousel--card
    const card = slide.querySelector('.services-carousel--card');
    if (!card) {
      rows.push(['', '']);
      return;
    }
    // Image
    const imgContainer = card.querySelector('.services-carousel--img-container');
    // Reference the actual <img> if present
    let img = null;
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    // Title and description
    const contentContainer = card.querySelector('.services-carousel--content-container');
    const cellContent = [];
    if (contentContainer) {
      // Title
      const titleEl = contentContainer.querySelector('.title');
      if (titleEl && titleEl.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        cellContent.push(strong);
      }
      // Description
      const descEl = contentContainer.querySelector('.description');
      if (descEl && descEl.textContent.trim()) {
        // Always use a <p> for description if present
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        cellContent.push(p);
      }
    }
    rows.push([
      img || '',
      cellContent.length === 1 ? cellContent[0] : cellContent // Keep single node or array
    ]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
