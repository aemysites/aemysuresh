/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Cards (cards7)'];

  // Find the carousel wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  const slides = swiperWrapper.querySelectorAll(':scope > .swiper-slide');
  const rows = [];

  slides.forEach(slide => {
    const card = slide.querySelector('.services-carousel--card');
    if (!card) return;
    // Image: select <img> inside .services-carousel--img-container
    const imgContainer = card.querySelector('.services-carousel--img-container');
    let imgElem = null;
    if (imgContainer) {
      imgElem = imgContainer.querySelector('img');
    }

    // Content: title and description
    const contentContainer = card.querySelector('.services-carousel--content-container');
    let contentCell = [];
    if (contentContainer) {
      const title = contentContainer.querySelector('.title');
      let titleElem = null;
      if (title && title.textContent.trim()) {
        titleElem = document.createElement('strong');
        titleElem.textContent = title.textContent.trim();
        contentCell.push(titleElem);
      }
      const desc = contentContainer.querySelector('.description');
      if (desc && desc.textContent.trim()) {
        // Description below title
        const descElem = document.createElement('div');
        descElem.textContent = desc.textContent.trim();
        contentCell.push(descElem);
      }
    }

    // Ensure both image and text are included. If missing, use empty placeholder.
    rows.push([
      imgElem || '',
      contentCell.length > 0 ? contentCell : ''
    ]);
  });

  // Assemble table
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
