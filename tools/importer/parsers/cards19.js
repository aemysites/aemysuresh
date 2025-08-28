/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row, exactly as in the example
  const headerRow = ['Cards (cards19)'];

  // Find the swiper-wrapper with the cards/slides
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  const cells = [headerRow];

  if (swiperWrapper) {
    const slides = swiperWrapper.querySelectorAll(':scope > .swiper-slide');
    slides.forEach((slide) => {
      // Each slide contains .image-carousel--card
      const card = slide.querySelector('.image-carousel--card');
      if (!card) return;

      // Extract image element (reference existing element)
      let imgEl = null;
      const imgContainer = card.querySelector('.image-carousel--img-container');
      if (imgContainer) {
        const img = imgContainer.querySelector('img');
        if (img) imgEl = img;
      }

      // Extract title (use strong to mimic bold heading)
      let titleEl = null;
      const contentContainer = card.querySelector('.image-carousel--content-container');
      if (contentContainer) {
        const title = contentContainer.querySelector('.title');
        if (title) {
          titleEl = document.createElement('strong');
          titleEl.textContent = title.textContent.trim();
        }
      }

      // Compose text cell: only the title in this source
      // If other text content existed, it would go here (none per HTML provided)
      let textCell;
      if (titleEl) {
        textCell = titleEl;
      } else {
        // Fallback if no title
        textCell = '';
      }

      // Compose row [image, text cell]
      cells.push([imgEl, textCell]);
    });
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in the DOM
  element.replaceWith(block);
}
