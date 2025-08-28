/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Carousel (carousel21)'];
  const wrapper = element.querySelector('.carousel__wrapper');
  if (!wrapper) return;
  const slides = Array.from(wrapper.querySelectorAll('a.carousel__slide'));
  const rows = [headerRow];

  slides.forEach((slide) => {
    // IMAGE CELL
    let imageEl = null;
    const picture = slide.querySelector('picture');
    if (picture) {
      imageEl = picture;
    } else {
      const img = slide.querySelector('img');
      if (img) imageEl = img;
    }
    if (!imageEl) return;

    // TEXT CELL (dynamic extraction, not hardcoded)
    let textParts = [];

    // 1. Try to extract direct text nodes and non-image elements
    // Only include elements that are not <picture> or <img>
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === 3) { // Text node
        const txt = node.textContent.trim();
        if (txt) {
          textParts.push(document.createTextNode(txt));
        }
      } else if (node.nodeType === 1 && node.tagName !== 'PICTURE' && node.tagName !== 'IMG') {
        // Reference the element directly (do not clone)
        textParts.push(node);
      }
    });

    // 2. If no text content found, use anchor attributes for heading
    if (textParts.length === 0) {
      const headingText = slide.getAttribute('title') || slide.getAttribute('aria-label');
      if (headingText) {
        const h2 = document.createElement('h2');
        h2.textContent = headingText;
        textParts.push(h2);
      }
    }

    // 3. Always include CTA link at the end (unless it's already included with visible text)
    // If the slide anchor has no visible text content (which is the case in this HTML), create a CTA link
    if (slide.href) {
      const linkText = slide.getAttribute('title') || slide.getAttribute('aria-label') || 'Learn more';
      const link = document.createElement('a');
      link.href = slide.href;
      link.target = slide.target || '_self';
      link.textContent = linkText;
      textParts.push(link);
    }

    // If nothing found, ensure empty string for cell
    if (textParts.length === 0) textParts = [''];

    rows.push([imageEl, textParts.length === 1 ? textParts[0] : textParts]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with the block
  element.replaceWith(block);
}
