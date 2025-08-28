/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as example
  const headerRow = ['Cards (cards7)'];
  const cells = [headerRow];

  // Find the carousel slides
  let slides = [];
  const carousel = element.querySelector('.swiper.services-carousel');
  if (carousel) {
    const wrapper = carousel.querySelector('.swiper-wrapper');
    if (wrapper) {
      slides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
    }
  }

  slides.forEach((slide) => {
    // Extract the card
    const card = slide.querySelector('.services-carousel--card');
    if (!card) return;

    // First cell: image (reference existing img element)
    const img = card.querySelector('.services-carousel--img-container img');

    // Second cell: text content (reference existing elements; preserve semantic)
    const contentContainer = card.querySelector('.services-carousel--content-container');
    const fragments = [];
    if (contentContainer) {
      // Title: styled as heading (strong)
      const title = contentContainer.querySelector('.title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        fragments.push(strong);
      }
      // Description: below heading
      const desc = contentContainer.querySelector('.description');
      if (desc && desc.textContent.trim()) {
        if (fragments.length > 0) fragments.push(document.createElement('br'));
        fragments.push(desc);
      }
    }
    // Push row (always 2 columns)
    cells.push([img, fragments]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}