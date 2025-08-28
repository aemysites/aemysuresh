/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as example
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get all card <a> elements directly under .swiper-wrapper
  const slides = element.querySelectorAll('.swiper-wrapper > a');
  slides.forEach((slide) => {
    // First cell: icon (always present, use reference)
    const icon = slide.querySelector('.swiper-slide__flight-icon') || '';
    // Second cell: all text content (including headings, paragraphs)
    const textCellParts = [];
    // Title (typically first <p> with title class, but be flexible)
    const title = slide.querySelector('.swiper-slide__main, .slider-heading-text');
    if (title) textCellParts.push(title);
    // Additional paragraphs (descriptions), but skip the title if already added
    slide.querySelectorAll('p').forEach((p) => {
      if (p !== title) textCellParts.push(p);
    });
    // CTA: only if the card is a link (use href from the <a>)
    if (slide.hasAttribute('href') && slide.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = slide.getAttribute('href');
      cta.textContent = 'Learn more';
      textCellParts.push(cta);
    }
    rows.push([icon, textCellParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
