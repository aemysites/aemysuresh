/* global WebImporter */
export default function parse(element, { document }) {
  // Find the wrapper holding the cards
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  // Get all visible card slides
  const slides = wrapper.querySelectorAll('.swiper-slide');

  // Start with the header row
  const rows = [['Cards (cards5)']];

  slides.forEach(slide => {
    // Each card
    const card = slide.querySelector('.image-carousel--card');
    if (!card) return;

    // Card image (first cell)
    const img = card.querySelector('.image-carousel--img-container img');
    // Always reference the image directly if found
    const imgCell = img || '';

    // Card title (second cell)
    const titleDiv = card.querySelector('.image-carousel--content-container .title');
    let contentCell = '';
    if (titleDiv) {
      // Use <strong> for title presentation as in the example
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      contentCell = [strong];
    }
    rows.push([
      imgCell,
      contentCell
    ]);
  });

  // Create the cards block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
