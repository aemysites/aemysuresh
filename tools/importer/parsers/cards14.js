/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER: Must exactly match the block name from instructions
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Get the card container
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  // Find all direct card children
  const slides = Array.from(wrapper.children).filter(child => child.matches('a.swiper-slide'));

  slides.forEach((slide) => {
    // ICON CELL: Use icon span if present, else empty string
    let iconCell = '';
    const iconSpan = slide.querySelector('.swiper-slide__flight-icon');
    if (iconSpan) iconCell = iconSpan;

    // TEXT CELL: Compose all text content in semantic order
    const textContainer = document.createElement('div');

    // Title (strong)
    const titleEl = slide.querySelector('.swiper-slide__main');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textContainer.appendChild(strong);
    }

    // Description paragraph (if present)
    const descEl = slide.querySelector('.swiper-slide__text p');
    if (descEl && descEl.textContent.trim()) {
      if (titleEl) textContainer.appendChild(document.createElement('br'));
      textContainer.appendChild(descEl);
    }

    // CTA: If slide is a link, include as link at bottom
    const href = slide.getAttribute('href');
    if (href) {
      textContainer.appendChild(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = href;
      cta.target = slide.getAttribute('target') || '_self';
      cta.textContent = 'Learn more';
      textContainer.appendChild(cta);
    }

    // If no text was found, use fallback: all textContent from slide
    if (!textContainer.textContent.trim()) {
      textContainer.textContent = slide.textContent.trim();
    }

    cells.push([iconCell, textContainer]);
  });

  // Create table using WebImporter API, replace original
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
