/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content
  const swiper = element.querySelector('.swiper.image-carousel');
  if (!swiper) return;
  const slides = swiper.querySelectorAll('.swiper-slide');
  const cells = [];
  // Table header
  cells.push(['Cards (cards8)']);
  slides.forEach((slide) => {
    // Find the card element
    const card = slide.querySelector('.image-carousel--card');
    if (!card) return;
    // Image (first cell)
    let img = null;
    const imgContainer = card.querySelector('.image-carousel--img-container');
    if (imgContainer) {
      img = imgContainer.querySelector('img'); // reference, do NOT clone
    }
    // Text (title, second cell)
    let titleEl = null;
    const contentContainer = card.querySelector('.image-carousel--content-container');
    if (contentContainer) {
      const titleDiv = contentContainer.querySelector('.title');
      if (titleDiv) {
        // Use element, but wrap in <strong>, as in example, if not already
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        titleEl = strong;
      }
    }
    // Add row only if at least image or title exists
    if (img || titleEl) {
      cells.push([
        img,
        titleEl
      ]);
    }
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
