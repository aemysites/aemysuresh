/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row as a single column
  const headerRow = ['Columns (columns18)'];

  // Collect the cards as columns in the block
  const cards = Array.from(element.querySelectorAll(':scope > a.offer-card'));

  // For each card, group all meaningful content in a wrapper per cell
  const columns = cards.map((card) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';

    // Add image from background (if present)
    let imgUrl = card.getAttribute('data-bg-image');
    if (!imgUrl) {
      const style = card.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
      if (match) imgUrl = match[1];
    }
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = 'auto';
      wrapper.appendChild(img);
    }

    // Add all non-empty direct children from the card (semantic grouping)
    Array.from(card.children).forEach(child => {
      // Only add if it contains text or non-decorative icons
      if (child.textContent.trim().length > 0) {
        wrapper.appendChild(child);
      }
    });

    // If no visible content at all, ensure image is present
    if (wrapper.childNodes.length === 0 && imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = 'auto';
      wrapper.appendChild(img);
    }
    // If still empty, add a blank div for structure
    if (wrapper.childNodes.length === 0) {
      wrapper.appendChild(document.createElement('div'));
    }
    return wrapper;
  });

  // Assemble the table: header is single column, next row is N columns for the cards
  const cells = [
    headerRow,
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
