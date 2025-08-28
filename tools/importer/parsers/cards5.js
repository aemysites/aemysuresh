/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel slides container
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));

  // Block table header, matches exactly the example
  const rows = [
    ['Cards (cards5)']
  ];

  slides.forEach((slide) => {
    // Get the image (reference the existing img element)
    const img = slide.querySelector('img');
    // Get the title text
    const titleDiv = slide.querySelector('.title');
    let title;
    if (titleDiv && titleDiv.textContent.trim()) {
      // Use <strong> for semantic heading-like emphasis, as in example screenshot
      title = document.createElement('strong');
      title.textContent = titleDiv.textContent.trim();
    } else {
      title = '';
    }
    rows.push([
      img,
      title
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
