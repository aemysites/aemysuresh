/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per instructions and example
  const header = ['Carousel (carousel17)'];
  const rows = [];

  // 1. Get the list of slides from the small carousel (thumbnails + location name)
  const smallCarousel = element.querySelector('.destination__carousel__small__swiper-container .destination__wrapper');
  if (!smallCarousel) return;
  const smallSlides = Array.from(smallCarousel.querySelectorAll('.swiper-slide'));

  // 2. Get the detailed carousel for text content & CTAs, matching by index
  const storyCarousel = element.querySelector('#carousalStoryFull .swiper-wrapper');
  const storySlides = storyCarousel ? Array.from(storyCarousel.querySelectorAll('.swiper-slide')) : [];

  smallSlides.forEach((smallSlide, idx) => {
    // --- IMAGE CELL ---
    const imageDiv = smallSlide.querySelector('.carousel-image');
    let imgUrl = imageDiv?.getAttribute('data-bg-image');
    let imgAlt = imageDiv?.getAttribute('title') || '';
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.alt = imgAlt;
      imgEl.title = imgAlt;
      imgEl.loading = 'lazy';
    }

    // --- TEXT CELL ---
    // Reference the entire trip-info block for text cell (more flexible, all text included)
    let textCell = '';
    let storySlide = storySlides[idx];
    if (storySlide) {
      const tripInfo = storySlide.querySelector('.trip-info');
      if (tripInfo && tripInfo.textContent.trim()) {
        textCell = tripInfo;
      }
    }
    // Fallback: use small carousel location name if tripInfo is missing
    if (!textCell) {
      const locNameEl = imageDiv?.querySelector('h5.location');
      if (locNameEl && locNameEl.textContent.trim()) {
        textCell = locNameEl;
      }
    }
    // Fallback: If no text, use empty string
    rows.push([
      imgEl,
      textCell || ''
    ]);
  });

  // Compose table cells as per block guidelines
  const cells = [header, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
