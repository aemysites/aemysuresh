/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW: must match exactly
  const cells = [['Carousel (carousel17)']];

  // Get thumbnail carousel (main round icon slides)
  const storyCarousel = element.querySelector('.discover__destination__stories .swiper-wrapper');
  // Get full story carousel (has heading, description, CTA)
  const fullStoryCarousel = element.querySelector('.story__view #carousalStoryFull .swiper-wrapper');

  // Defensive: Ensure these exist, else fallback to nothing so code doesn't fail
  const thumbSlides = storyCarousel ? Array.from(storyCarousel.children) : [];
  const fullSlides = fullStoryCarousel ? Array.from(fullStoryCarousel.children) : [];
  
  // Loop for every visible thumbnail slide
  for (let i = 0; i < thumbSlides.length; i++) {
    // --- IMAGE CELL --- //
    let img = null;
    let codeText = '';
    let imgAlt = '';
    let imgTitle = '';
    // Try to get image and code from thumb slide
    const slideContent = thumbSlides[i].querySelector('.slide-content');
    let imgUrl = '';
    if (slideContent) {
      imgUrl = slideContent.getAttribute('data-bg-image') || '';
      imgAlt = slideContent.getAttribute('title') || '';
      imgTitle = imgAlt;
      const codeSpan = slideContent.querySelector('span.z-2');
      codeText = codeSpan ? codeSpan.textContent.trim() : '';
    }
    if (imgUrl) {
      img = document.createElement('img');
      img.src = imgUrl;
      img.alt = imgAlt || codeText;
      img.title = imgTitle || codeText;
      img.width = 750;
      img.height = 584;
      img.loading = 'lazy';
    }
    // --- TEXT CELL --- //
    // Grab the full slide for text content: Heading, Description, CTA
    let textCellContent = [];
    if (fullSlides[i]) {
      const tripInfo = fullSlides[i].querySelector('.trip-info');
      if (tripInfo) {
        // Heading (h2 for semantic markup - matches example)
        const titleEl = tripInfo.querySelector('.location-title');
        if (titleEl && titleEl.textContent.trim()) {
          const h2 = document.createElement('h2');
          h2.textContent = titleEl.textContent.trim();
          textCellContent.push(h2);
        }
        // Description
        const descEl = tripInfo.querySelector('.description');
        if (descEl && descEl.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = descEl.textContent.trim();
          textCellContent.push(p);
        }
        // CTA (Explore link): always reference original element
        const cta = tripInfo.querySelector('.btn-explore');
        if (cta) {
          textCellContent.push(document.createElement('br'));
          textCellContent.push(cta);
        }
      }
    }
    // Fallback: If textCellContent is still empty, use code text if present
    if (textCellContent.length === 0 && codeText) {
      const h2 = document.createElement('h2');
      h2.textContent = codeText;
      textCellContent.push(h2);
    }

    // Only add row if there's an image (matches typical carousel usage)
    if (img) {
      cells.push([
        img,
        textCellContent.length === 1 ? textCellContent[0] : textCellContent // array or single element
      ]);
    }
  }

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
