/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card image from background-image/data-bg-image
  function getCardImage(card) {
    // Prefer style background-image, then data-bg-image
    let style = card.getAttribute('style') || '';
    let imgSrc = '';
    const urlMatch = style.match(/background-image: url\(['"]?([^'"]+)['"]?\)/);
    if (urlMatch && urlMatch[1]) {
      imgSrc = urlMatch[1];
    } else {
      imgSrc = card.getAttribute('data-bg-image') || card.getAttribute('data-bg-mobile-image') || '';
    }
    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = '';
      img.loading = 'lazy';
      return img;
    }
    return '';
  }

  // Helper to collect all relevant text and semantic content from card
  function getCardContent(card) {
    const parts = [];
    // Gather all direct children that may contain meaningful content
    Array.from(card.children).forEach(child => {
      // If offer-section-2, keep its full semantic content
      if (child.classList.contains('offer-section-2')) {
        parts.push(child);
      }
      // If offer-section-1 (may have banners, T&C, icons)
      else if (child.classList.contains('offer-section-1')) {
        // Include banners and visible notes, skip icons
        child.querySelectorAll('.offer-section1-banner, .body-medium-light').forEach(el => {
          if (el.textContent && el.textContent.trim()) {
            parts.push(el);
          }
        });
      }
      // If other divs with class body-medium-light or offer-section2-banner
      else if (child.classList.contains('body-medium-light') || child.classList.contains('offer-section2-banner')) {
        if (child.textContent && child.textContent.trim()) {
          parts.push(child);
        }
      }
    });
    // Also include any heading (h3, h2) that is direct child or inside offer-section-2
    card.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      if (h.textContent && h.textContent.trim() && !parts.includes(h)) {
        parts.push(h);
      }
    });
    // Also include any top-level text node (not inside an icon or empty div)
    Array.from(card.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        parts.push(span);
      }
    });
    // If no content found, fallback to all text content
    if (parts.length === 0 && card.textContent && card.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = card.textContent.trim();
      parts.push(span);
    }
    // Add CTA (link) only if it's not already present and the card is <a>
    if (card.tagName === 'A' && card.href) {
      const ctaExists = parts.some(p => p.tagName === 'A' && p.href === card.href);
      if (!ctaExists) {
        const cta = document.createElement('a');
        cta.href = card.href;
        cta.textContent = (card.title && card.title.trim()) || (card.getAttribute('aria-label') && card.getAttribute('aria-label').trim()) || 'Learn more';
        cta.target = '_blank';
        parts.push(cta);
      }
    }
    // Return single element or array for cell
    if (parts.length === 1) return parts[0];
    return parts;
  }

  // Build table
  const cells = [['Cards (cards20)']];
  // Only direct child <a.offer-card>
  const cards = Array.from(element.querySelectorAll(':scope > a.offer-card'));
  cards.forEach(card => {
    const img = getCardImage(card);
    const content = getCardContent(card);
    cells.push([img, content]);
  });
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
