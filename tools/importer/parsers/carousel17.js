/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel wrapper
  const storyView = element.querySelector('.story__view');
  if (!storyView) return;

  // Find all slides in the main carousel
  const slides = storyView.querySelectorAll('.swiper-slide');
  if (!slides.length) return;

  // Table header as per block guidelines
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    // Find the .background-content picture/img
    let imgEl = null;
    const bgContent = slide.querySelector('.background-content');
    if (bgContent) {
      // Prefer <img> inside <picture>
      const picture = bgContent.querySelector('picture');
      if (picture) {
        imgEl = picture.querySelector('img');
      }
    }
    // Defensive fallback: if no image found, skip this slide
    if (!imgEl) return;

    // --- TEXT CELL ---
    // Find the trip info block
    let textCellContent = [];
    const tripInfo = slide.querySelector('.trip-info');
    if (tripInfo) {
      // Title
      const title = tripInfo.querySelector('.location-title');
      if (title) {
        // Convert h5 to h2 for block semantics
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent;
        textCellContent.push(h2);
      }
      // Description
      const desc = tripInfo.querySelector('.description');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textCellContent.push(p);
      }
      // CTA (Explore button)
      const exploreBtn = tripInfo.querySelector('.btn-explore');
      if (exploreBtn) {
        // Use as link
        const link = document.createElement('a');
        link.href = exploreBtn.href;
        link.textContent = exploreBtn.textContent.trim();
        link.target = exploreBtn.target || '_blank';
        textCellContent.push(link);
      }
      // Also include any additional text content (for flexibility)
      // Get all <p> elements that are not .description
      tripInfo.querySelectorAll('p').forEach((p) => {
        if (!p.classList.contains('description')) {
          if (p.textContent.trim()) {
            const pClone = document.createElement('p');
            pClone.textContent = p.textContent;
            textCellContent.push(pClone);
          }
        }
      });
      // Get all <a> elements that are not .btn-explore
      tripInfo.querySelectorAll('a').forEach((a) => {
        if (!a.classList.contains('btn-explore')) {
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent.trim();
          link.target = a.target || '_blank';
          textCellContent.push(link);
        }
      });
    }
    // Defensive: If no text, cell is empty string
    if (!textCellContent.length) textCellContent = [''];

    // Add row: [image, text]
    rows.push([imgEl, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
