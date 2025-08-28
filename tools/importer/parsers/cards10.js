/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name as in the example
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Find all card items (hotel cards) - one per .swiper-slide
  const slides = element.querySelectorAll('.swiper-slide');
  slides.forEach(slide => {
    const item = slide.querySelector('.seo-hotel-strip--item');
    if (!item) return; // skip if not found

    // First cell: image
    const imgBlock = item.querySelector('.seo-hotel-strip--image-block');
    const imgEl = imgBlock ? imgBlock.querySelector('img') : null;
    // Only proceed if image and info both exist
    const info = item.querySelector('.seo-hotel-strip--info');
    if (!imgEl || !info) return;

    // Second cell: text content
    // We'll reference the relevant block from the info area
    // Try to keep all info together semantically
    
    // Create a staging container for the text cell
    const textCell = document.createElement('div');

    // Title (hotel name)
    const titleEl = info.querySelector('.seo-hotel-strip--title-block--title');
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      textCell.appendChild(h3);
    }

    // Location line (city + stars)
    const ratingHotelBlock = info.querySelector('.seo-hotel-strip--title-block--rating-hotel');
    if (ratingHotelBlock) {
      // Reference the whole block so both city and stars are included and styling/structure is preserved
      textCell.appendChild(ratingHotelBlock);
    }

    // Rating (e.g. '4.2/5 (783 reviews)')
    const ratingBlock = item.querySelector('.seo-hotel-strip--image-block .seo-hotel-strip--rating');
    if (ratingBlock) {
      textCell.appendChild(ratingBlock);
    }

    // Price area
    const priceBlock = info.querySelector('.seo-hotel-strip--price-block');
    if (priceBlock) {
      // Get the price information
      const wrapper = priceBlock.querySelector('.seo-hotel-strip--price-block--wrapper');
      if (wrapper) {
        // We'll reference the .seo-hotel-strip--price-block--price block (actual price + hotel price)
        const priceInnerBlock = wrapper.querySelector('.seo-hotel-strip--price-block--price');
        if (priceInnerBlock) {
          textCell.appendChild(priceInnerBlock);
        }
        // Tax info
        const taxBlock = wrapper.querySelector('.seo-hotel-strip--price-block--tax');
        if (taxBlock) {
          textCell.appendChild(taxBlock);
        }
      }
      // Call-to-action button
      const ctaBtn = priceBlock.querySelector('button.seo-hotel-strip--book-now-cta');
      if (ctaBtn) {
        textCell.appendChild(ctaBtn);
      }
    }

    // Add this card row: image | text
    rows.push([imgEl, textCell]);
  });

  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
