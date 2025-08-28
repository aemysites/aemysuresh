/* global WebImporter */
export default function parse(element, { document }) {
  // Find the swiper-wrapper containing the cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));

  // Prepare table rows: first is header
  const rows = [['Cards (cards15)']];

  // Each slide is a card
  slides.forEach((slide) => {
    // Image
    const img = slide.querySelector('.image-carousel--img-container img');
    // Title
    const titleContainer = slide.querySelector('.image-carousel--content-container .title');
    // Description (if present)
    // Try to find a description under the title (not present in the current HTML, but future-proof)
    let descriptionEl = null;
    const contentContainer = slide.querySelector('.image-carousel--content-container');
    if (contentContainer) {
      // Any text nodes after the title div?
      // Get all child nodes, filter out the title node
      let foundTitle = false;
      Array.from(contentContainer.childNodes).forEach((node) => {
        if (node === titleContainer) {
          foundTitle = true;
        } else if (foundTitle && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Text node after title
          if (!descriptionEl) descriptionEl = document.createElement('p');
          descriptionEl.textContent += node.textContent.trim();
        } else if (foundTitle && node.nodeType === Node.ELEMENT_NODE && node !== titleContainer) {
          // Any element after title
          if (!descriptionEl) descriptionEl = document.createElement('p');
          descriptionEl.textContent += node.textContent.trim();
        }
      });
    }
    // Compose cell content
    let cellContent = [];
    if (titleContainer) {
      const strong = document.createElement('strong');
      strong.textContent = titleContainer.textContent.trim();
      cellContent.push(strong);
      if (descriptionEl && descriptionEl.textContent.trim()) {
        cellContent.push(document.createElement('br'));
        cellContent.push(descriptionEl);
      }
    }
    // Add card row only if image and title exist
    if (img && cellContent.length) {
      rows.push([
        img,
        cellContent
      ]);
    }
  });

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
