/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Columns (columns18)'];

  // Each direct child <a.offer-card> is a column
  const cards = Array.from(element.querySelectorAll(':scope > a.offer-card'));

  // For each card, extract all text and visual content for resiliency & completeness
  const colCells = cards.map((card) => {
    const colContent = [];

    // Add background image as <img> if present
    let imgUrl = '';
    const dataBg = card.getAttribute('data-bg-image');
    if (dataBg) {
      imgUrl = dataBg;
    } else if (card.style && card.style.backgroundImage) {
      const match = card.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
      if (match) imgUrl = match[1];
    }
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.loading = 'lazy';
      img.alt = '';
      colContent.push(img);
    }

    // Include ALL visible children (offer-section-1, offer-section-2, banners, etc.)
    Array.from(card.children).forEach(child => {
      // Only add if child has visible text or elements
      if (child.textContent.trim() || child.querySelector('*')) {
        colContent.push(child);
      }
    });

    // Add direct text nodes (rare, but possible)
    Array.from(card.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        colContent.push(document.createTextNode(node.textContent));
      }
    });

    // Always include a link to the card's href, using most prominent visible text
    if (card.href) {
      // Try heading, banner, else fallback to card's innerText
      let linkText = '';
      const h3 = card.querySelector('h3');
      if (h3 && h3.textContent.trim()) {
        linkText = h3.textContent.trim();
      } else {
        // find banner or strong text
        const banner = card.querySelector('.offer-section1-banner, .offer-section2-banner');
        if (banner && banner.textContent.trim()) {
          linkText = banner.textContent.trim();
        } else {
          linkText = card.innerText.trim() || 'View Offer';
        }
      }
      const link = document.createElement('a');
      link.href = card.href;
      link.textContent = linkText;
      link.target = '_blank';
      link.rel = 'noopener';
      colContent.push(link);
    }

    // Ensure semantic meaning: if only link and img, and card has further text, add that too
    // Avoid duplicate elements, but preserve order
    return colContent;
  });

  const rows = [headerRow, colCells];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
