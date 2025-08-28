/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards11)'];
  const cells = [headerRow];

  // Find all card elements in the containers
  // There are two containers for cards
  const cardMainContainer = element.querySelector('.card-main-container');
  const cardExtraContainer = element.querySelector('.card-extra-container');

  const cardNodes = [];
  if (cardMainContainer) {
    cardMainContainer.querySelectorAll('.card').forEach(card => cardNodes.push(card));
  }
  if (cardExtraContainer) {
    cardExtraContainer.querySelectorAll('.card').forEach(card => cardNodes.push(card));
  }

  cardNodes.forEach(card => {
    // Image, always present
    const img = card.querySelector('img');

    // Card Details
    const details = card.querySelector('.card--details');
    const textContent = [];

    // Ribbon (e.g., Trending) as a strong, if present
    const ribbon = card.querySelector('.ribbon');
    if (ribbon) {
      const strong = document.createElement('strong');
      strong.textContent = ribbon.textContent;
      textContent.push(strong);
      textContent.push(document.createElement('br'));
    }

    if (details) {
      // Title
      const title = details.querySelector('.card--title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent;
        textContent.push(strong);
      }
      // Description (optional)
      const desc = details.querySelector('.card--description');
      if (desc) {
        textContent.push(document.createElement('br'));
        textContent.push(desc);
      }
      // Info (e.g. Exploration time)
      const info = details.querySelector('.card--info');
      if (info) {
        textContent.push(document.createElement('br'));
        textContent.push(info);
      }
    }

    // Only add the row if both image and textContent exist
    if (img && textContent.length > 0) {
      cells.push([img, textContent]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
