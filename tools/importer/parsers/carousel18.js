/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row matches example exactly
  const cells = [['Carousel (carousel18)']];

  // 2. Find all destination/thumb slides (always present)
  const thumbSlidesContainer = element.querySelector('.discover__destination__stories .swiper-wrapper.story-wrapper');
  const thumbSlides = thumbSlidesContainer ? Array.from(thumbSlidesContainer.children).filter(e => e.classList.contains('swiper-slide')) : [];

  // 3. Find matching detailed story slides for text
  const storySlidesContainer = element.querySelector('.story__view .carousal-story-full .swiper-wrapper');
  const storySlides = storySlidesContainer ? Array.from(storySlidesContainer.children).filter(e => e.classList.contains('swiper-slide')) : [];

  // 4. For every destination/thumb slide, assemble row
  for (let i = 0; i < thumbSlides.length; i++) {
    // --- IMAGE CELL ---
    let imgCell = '';
    const slideContent = thumbSlides[i].querySelector('.slide-content');
    if (slideContent) {
      const imgUrl = slideContent.getAttribute('data-bg-image');
      if (imgUrl) {
        imgCell = document.createElement('img');
        imgCell.src = imgUrl;
        imgCell.alt = slideContent.getAttribute('title') || '';
        imgCell.setAttribute('loading', 'lazy');
      }
    }
    
    // --- TEXT CELL ---
    let textCell = '';
    if (storySlides[i]) {
      // Rather than selecting individual fields, reference the entire .trip-info block for resilience
      const tripInfo = storySlides[i].querySelector('.trip-info');
      if (tripInfo && tripInfo.textContent.trim()) {
        textCell = tripInfo;
      }
    }
    // If .trip-info is missing or empty, provide empty string (never undefined/null)
    cells.push([imgCell, textCell]);
  }

  // 5. Output single table, no extra rows, no markdown, no metadata table
  // 6. Replace original element with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
