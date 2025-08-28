/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards8) block header row
  const headerRow = ['Cards (cards8)'];

  // Find carousel slides
  const swiper = element.querySelector('.swiper.image-carousel');
  if (!swiper) return;
  const slides = swiper.querySelectorAll('.swiper-slide');

  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide contains .image-carousel--card
    const card = slide.querySelector('.image-carousel--card');
    if (!card) return;

    // Get image element (mandatory)
    const imgElem = card.querySelector('.image-carousel--img-container img');

    // Get title text (mandatory)
    const titleDiv = card.querySelector('.image-carousel--content-container .title');
    let titleElem = null;
    if (titleDiv && titleDiv.textContent.trim()) {
      // Use <strong> to preserve heading style from markdown example
      titleElem = document.createElement('strong');
      titleElem.textContent = titleDiv.textContent.trim();
    } else {
      titleElem = '';
    }

    // Get description (optional)
    // In provided HTML, description is missing. Still structure for it.
    // Try to find a description element under content container (more resilient)
    let descElem = null;
    const contentContainer = card.querySelector('.image-carousel--content-container');
    if (contentContainer) {
      // Any paragraph (p), span, or div that is not the title
      const descCandidates = Array.from(contentContainer.children).filter(child =>
        child !== titleDiv && (child.tagName === 'P' || child.tagName === 'SPAN' || (child.tagName === 'DIV' && child !== titleDiv))
      );
      if (descCandidates.length > 0) {
        descElem = descCandidates[0];
      }
    }
    // Prepare cell 2: array of [titleElem, descElem], filter out empty/nulls
    const cell2Content = [titleElem];
    if (descElem) cell2Content.push(descElem);

    rows.push([
      imgElem || '',
      cell2Content
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
