/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the carousel wrapper containing the cards
  const carousel = element.querySelector('.swiper-wrapper');
  if (!carousel) return;

  // Get all card slides
  const slides = carousel.querySelectorAll(':scope > .swiper-slide');
  if (!slides.length) return;

  // Table header
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide contains a card
    const card = slide.querySelector('.image-carousel--card');
    if (!card) return;

    // Image container
    const imgContainer = card.querySelector('.image-carousel--img-container img');
    // Defensive: Only add if image exists
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer;
    }

    // Title container
    const titleContainer = card.querySelector('.image-carousel--content-container .title');
    let textEl = null;
    if (titleContainer) {
      // Create a heading element for the title
      const heading = document.createElement('h3');
      heading.textContent = titleContainer.textContent.trim();
      textEl = heading;
    }

    // Add row: [image, title]
    rows.push([
      imgEl,
      textEl
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
