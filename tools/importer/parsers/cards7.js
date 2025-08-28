/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Cards (cards7)'];

  // 2. Find all cards inside the carousel
  // The actual cards are inside .swiper-wrapper > .swiper-slide > .services-carousel--card
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) {
    // If there's no swiper wrapper, nothing to process, so just return
    return;
  }

  const slides = swiperWrapper.querySelectorAll('.swiper-slide');
  const rows = [];

  slides.forEach((slide) => {
    const card = slide.querySelector('.services-carousel--card');
    if (!card) return;

    // IMAGE/ICON (mandatory)
    const imgEl = card.querySelector('.services-carousel--img-container img');
    let image = imgEl || '';

    // TEXT CONTENT (mandatory)
    const contentContainer = card.querySelector('.services-carousel--content-container');
    let textCell = [];
    if (contentContainer) {
      // Title (optional)
      const titleEl = contentContainer.querySelector('.title');
      if (titleEl && titleEl.textContent.trim()) {
        // Use strong for heading (as styled in the example)
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        textCell.push(strong);
      }
      // Description (optional)
      const descEl = contentContainer.querySelector('.description');
      if (descEl && descEl.textContent.trim()) {
        // Add a <br> if there is a title
        if (textCell.length > 0) {
          textCell.push(document.createElement('br'));
        }
        textCell.push(descEl);
      }
    }
    // Fallback if something is missing
    if (textCell.length === 0) {
      textCell = '';
    }
    // Each row: [image, text content]
    rows.push([image, textCell]);
  });

  // 3. Compose final cells array
  const cells = [headerRow, ...rows];

  // 4. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}