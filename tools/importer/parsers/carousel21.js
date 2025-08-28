/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header EXACT match
  const headerRow = ['Carousel (carousel21)'];

  // 2. Find carousel slides (direct children <a> inside .carousel__wrapper)
  const wrapper = element.querySelector('.carousel__wrapper');
  if (!wrapper) return;
  const slides = Array.from(wrapper.children).filter(child => child.tagName === 'A');

  // 3. Parse each slide
  const rows = slides.map((slide) => {
    // IMAGE: always in <picture><img>
    let img = null;
    const picture = slide.querySelector('picture');
    if (picture) {
      const picImg = picture.querySelector('img');
      if (picImg) img = picImg;
    }

    // TEXT CONTENT: Capture all non-picture content
    // Instead of piecing together text nodes, we reference all elements except <picture>
    const textEls = [];
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.tagName !== 'PICTURE') {
        // Reference the actual element
        textEls.push(node);
      } else if (node.nodeType === 3) {
        const text = node.textContent.trim();
        if (text) {
          const span = document.createElement('span');
          span.textContent = text;
          textEls.push(span);
        }
      }
    });

    // Add link as CTA at the bottom (never invent content)
    const href = slide.getAttribute('href');
    if (href) {
      let linkText = slide.getAttribute('title') || slide.getAttribute('aria-label') || '';
      // If no title or aria-label, try to find a visible text child
      if (!linkText) {
        // Just use href as fallback if absolutely no label
        linkText = href;
      }
      const cta = document.createElement('a');
      cta.href = href;
      cta.textContent = linkText;
      cta.target = slide.getAttribute('target') || '_self';
      // Only add CTA if not already present as a text element
      textEls.push(document.createElement('br'));
      textEls.push(cta);
    }

    // Edge case: If nothing in textEls, use empty string as cell
    return [img || '', textEls.length ? textEls : ''];
  });

  // 4. Build block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
