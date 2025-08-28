/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Cards (cards22)'];

  // Get all direct card anchors
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  const rows = cards.map((card) => {
    // IMAGE/ICON CELL
    let imageEl = null;
    let imgSrc = card.getAttribute('data-bg-image');
    if (!imgSrc && card.style.backgroundImage) {
      const match = card.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match) imgSrc = match[1];
    }
    if (imgSrc) {
      imageEl = document.createElement('img');
      imageEl.src = imgSrc;
      imageEl.alt = '';
    } else {
      // Try referenced icon span
      const iconSpan = card.querySelector('.offer-section1-icon');
      if (iconSpan) imageEl = iconSpan;
    }
    if (!imageEl) {
      imageEl = document.createElement('div'); // fallback, always one element
    }

    // TEXT CELL: collect all relevant visible text content with semantic meaning
    const textContentEls = [];
    // 1. Headings inside card
    Array.from(card.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach((h) => {
      textContentEls.push(h);
    });
    // 2. Offer banners and descriptions (preserving original elements)
    Array.from(card.querySelectorAll('.offer-section1-banner, .offer-section2-banner, .body-medium-light')).forEach((descEl) => {
      if (descEl.textContent.trim()) {
        textContentEls.push(descEl);
      }
    });
    // 3. Find all direct text nodes outside above elements
    Array.from(card.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textContentEls.push(p);
      }
    });
    // 4. Add CTA link (the card itself)
    if (card.href) {
      const cta = document.createElement('a');
      cta.href = card.href;
      cta.textContent = 'Learn more';
      cta.target = '_blank';
      textContentEls.push(cta);
    }
    // 5. If nothing found, fallback to card title
    if (textContentEls.length === 0 && card.title) {
      const fallbackHeading = document.createElement('h3');
      fallbackHeading.textContent = card.title;
      textContentEls.push(fallbackHeading);
    }
    // 6. Always at least one element
    if (textContentEls.length === 0) {
      textContentEls.push(document.createElement('div'));
    }

    return [imageEl, textContentEls];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
