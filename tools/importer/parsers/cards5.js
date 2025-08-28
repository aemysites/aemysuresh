/* global WebImporter */
export default function parse(element, { document }) {
  // Table header per block definition
  const headerRow = ['Cards (cards5)'];

  // Find the main carousel wrapper
  const swiper = element.querySelector('.swiper.image-carousel');
  if (!swiper) return;
  const slides = swiper.querySelectorAll('.swiper-slide');

  // Prepare table rows
  const rows = Array.from(slides).map(slide => {
    // Find image in card
    const imgContainer = slide.querySelector('.image-carousel--img-container');
    const img = imgContainer && imgContainer.querySelector('img');
    // Find title in card
    const contentContainer = slide.querySelector('.image-carousel--content-container');
    let title = '';
    if (contentContainer) {
      const titleDiv = contentContainer.querySelector('.title');
      if (titleDiv) {
        // Use <strong> for the title as in the markdown example
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        title = strong;
      }
    }
    // Compose the card cells per spec (image | title)
    // If either image or text missing, cell will be empty, but structure will be maintained.
    return [img || '', title || ''];
  });

  // Compose the table (header row, then each card as one row)
  const cells = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
