/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - must match example exactly
  const headerRow = ['Carousel (carousel17)'];
  const rows = [];

  // Helper: create <img> from a background image
  function makeImg(src, alt) {
    if (!src) return '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    return img;
  }

  // Find all slides in the small carousel
  const wrapper = element.querySelector('.destination__carousel__small__swiper-container .destination__wrapper');
  if (!wrapper) return;
  const slides = Array.from(wrapper.querySelectorAll(':scope > .swiper-slide'));

  // Find all detail slides for text content
  const detailCarousel = element.querySelector('#carousalStoryFull .swiper-wrapper');
  const detailSlides = detailCarousel ? Array.from(detailCarousel.querySelectorAll(':scope > .swiper-slide')) : [];

  slides.forEach((slide, i) => {
    // ----- IMAGE CELL -----
    const imgDiv = slide.querySelector('.carousel-image');
    const bgImg = imgDiv?.getAttribute('data-bg-image') || '';
    // Title for alt
    let locationTitle = '';
    const h5 = imgDiv?.querySelector('h5');
    if (h5) {
      locationTitle = h5.getAttribute('aria-label') || h5.textContent.trim();
    }
    const imgEl = makeImg(bgImg, locationTitle);

    // ----- TEXT CELL -----
    // Extract all text content (heading, description, CTA) from .trip-info for semantic accuracy
    let textCellContent = [];
    let foundTripInfo = false;
    if (detailSlides[i]) {
      const tripInfo = detailSlides[i].querySelector('.trip-info');
      if (tripInfo) {
        foundTripInfo = true;
        // Heading (h5)
        const heading = tripInfo.querySelector('h5');
        if (heading && heading.textContent.trim()) {
          // Use h2 for output, but reference the original heading element for semantic meaning
          textCellContent.push(heading);
        }
        // Description (p.h4)
        const descElem = tripInfo.querySelector('p.h4');
        if (descElem && descElem.textContent.trim()) {
          textCellContent.push(descElem);
        }
        // CTA (Explore button)
        const exploreBtn = tripInfo.querySelector('a.btn-explore');
        if (exploreBtn) {
          textCellContent.push(exploreBtn);
        }
      }
    }
    // Fallback: If no trip-info, just push the locationTitle as a heading
    if (!foundTripInfo && locationTitle) {
      const headingEl = document.createElement('h2');
      headingEl.textContent = locationTitle;
      textCellContent.push(headingEl);
    }
    // If no text content at all, use empty string
    if (textCellContent.length === 0) {
      textCellContent = [''];
    }

    // Table row: ensure each row is an array with 2 columns
    rows.push([imgEl, textCellContent.length === 1 ? textCellContent[0] : textCellContent]);
  });

  // Build table (header row must be single column)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original element
  element.replaceWith(table);
}
