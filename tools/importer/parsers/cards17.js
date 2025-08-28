/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly
  const headerRow = ['Cards (cards17)'];
  const rows = [];

  // Find the swiper-wrapper containing all card slides
  const swiper = element.querySelector('.swiper-wrapper');
  if (swiper) {
    const slides = swiper.querySelectorAll(':scope > .swiper-slide');
    slides.forEach((slide) => {
      const card = slide.querySelector('.services-carousel--card');
      if (!card) return;
      // Image in first cell
      let imgEl = null;
      const imgContainer = card.querySelector('.services-carousel--img-container');
      if (imgContainer) {
        const img = imgContainer.querySelector('img');
        if (img) {
          imgEl = img;
        }
      }
      // Text content in second cell (title, description)
      const contentContainer = card.querySelector('.services-carousel--content-container');
      const textContent = [];
      if (contentContainer) {
        const title = contentContainer.querySelector('.title');
        if (title && title.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = title.textContent.trim();
          textContent.push(strong);
        }
        const description = contentContainer.querySelector('.description');
        if (description && description.textContent.trim()) {
          const descP = document.createElement('p');
          descP.textContent = description.textContent.trim();
          textContent.push(descP);
        }
      }
      // Only push row if both image and textContent exist
      if (imgEl && textContent.length > 0) {
        rows.push([
          imgEl,
          textContent.length === 1 ? textContent[0] : textContent
        ]);
      }
    });
  }
  // Only create table if there are rows
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
