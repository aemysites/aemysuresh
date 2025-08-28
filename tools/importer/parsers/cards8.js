/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards8)'];
  const cells = [headerRow];

  // Find the swiper-wrapper containing all cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (swiperWrapper) {
    // Find all direct swiper-slide children
    const slides = swiperWrapper.querySelectorAll(':scope > .swiper-slide');
    slides.forEach((slide) => {
      const card = slide.querySelector('.image-carousel--card');
      if (!card) return;
      // Image (first cell)
      const imgEl = card.querySelector('.image-carousel--img-container img');
      // Title (second cell)
      let textCellContents = [];
      const titleContainer = card.querySelector('.image-carousel--content-container .title');
      if (titleContainer) {
        // Use <strong> for the title, maintain semantic meaning
        const strongEl = document.createElement('strong');
        strongEl.textContent = titleContainer.textContent.trim();
        textCellContents.push(strongEl);
      }
      cells.push([
        imgEl,
        textCellContents
      ]);
    });
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
