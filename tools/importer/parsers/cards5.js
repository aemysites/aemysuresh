/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block spec
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Defensive: Find the carousel wrapper (may be section or div)
  let carouselSection = element.querySelector('.cmp-imagecarousel') || element;
  // Find the swiper wrapper containing all slides
  const swiperWrapper = carouselSection.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all slides (cards)
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');

  slides.forEach((slide) => {
    // Each slide contains .image-carousel--card
    const card = slide.querySelector('.image-carousel--card');
    if (!card) return;

    // Image: inside .image-carousel--img-container
    const imgContainer = card.querySelector('.image-carousel--img-container');
    let img = imgContainer ? imgContainer.querySelector('img') : null;
    // Defensive: Only include if img exists
    let imgCell = img ? img : '';

    // Text: inside .image-carousel--content-container > .title
    const contentContainer = card.querySelector('.image-carousel--content-container');
    let title = contentContainer ? contentContainer.querySelector('.title') : null;
    let textCell = '';
    if (title) {
      // Create a heading element for the card title
      const heading = document.createElement('h3');
      heading.textContent = title.textContent.trim();
      textCell = heading;
    }

    rows.push([imgCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
