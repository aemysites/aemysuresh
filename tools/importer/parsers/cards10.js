/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) header row exactly as required
  const cells = [['Cards (cards10)']];

  // Find the main swiper wrapper for hotel cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  // Each card is a .swiper-slide
  const slides = swiperWrapper.querySelectorAll(':scope > .swiper-slide');

  slides.forEach(slide => {
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return;

    // First cell: the image element from .seo-hotel-strip--image-block img
    let imageCell = null;
    const img = card.querySelector('.seo-hotel-strip--image-block img');
    if (img) {
      imageCell = img;
    }

    // Second cell: all structured text content
    const textCell = document.createElement('div');
    // Title
    const titleEl = card.querySelector('.seo-hotel-strip--title-block--title');
    if (titleEl) {
      const heading = document.createElement('strong');
      heading.textContent = titleEl.textContent;
      textCell.appendChild(heading);
      textCell.appendChild(document.createElement('br'));
    }
    // Location and stars (combine inline)
    const locationEl = card.querySelector('.seo-hotel-strip--location span');
    const starsEl = card.querySelector('.seo-hotel-strip--stars');
    if (locationEl || starsEl) {
      const locationStars = document.createElement('span');
      let locText = locationEl ? locationEl.textContent.trim() : '';
      let starText = '';
      if (starsEl) {
        const starCount = starsEl.querySelectorAll('.icon-star_filled').length;
        if (starCount > 0) {
          starText = ' ' + '★'.repeat(starCount);
        }
      }
      locationStars.textContent = locText + starText;
      if (locationStars.textContent.trim().length) {
        textCell.appendChild(locationStars);
        textCell.appendChild(document.createElement('br'));
      }
    }
    // Rating (e.g. "4.2/5 (783 reviews)")
    const ratingBlock = card.querySelector('.seo-hotel-strip--rating');
    if (ratingBlock) {
      // Directly reference the rating block which contains both pieces
      textCell.appendChild(ratingBlock);
      textCell.appendChild(document.createElement('br'));
    }
    // Price block (actual price and/or discounted price)
    const priceBlock = card.querySelector('.seo-hotel-strip--price-block--price');
    if (priceBlock) {
      // actual-price (sometimes empty), then hotel-price
      const actualPrice = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
      if (actualPrice && actualPrice.textContent.trim()) {
        textCell.appendChild(actualPrice);
        textCell.appendChild(document.createElement('br'));
      }
      const hotelPrice = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
      if (hotelPrice) {
        textCell.appendChild(hotelPrice);
        textCell.appendChild(document.createElement('br'));
      }
    }
    // Tax info
    const taxBlock = card.querySelector('.seo-hotel-strip--price-block--tax');
    if (taxBlock) {
      textCell.appendChild(taxBlock);
      textCell.appendChild(document.createElement('br'));
    }
    // CTA button
    const bookBtn = card.querySelector('.seo-hotel-strip--book-now-cta');
    if (bookBtn) {
      textCell.appendChild(bookBtn);
    }

    // Remove trailing <br> if present
    while (textCell.lastChild && textCell.lastChild.tagName === 'BR') {
      textCell.removeChild(textCell.lastChild);
    }

    cells.push([
      imageCell,
      textCell
    ]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
