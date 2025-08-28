/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example
  const headerRow = ['Cards (cards14)'];

  // 2. Get all cards (swiper-slide > .seo-hotel-strip--item)
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.children).filter(child => child.classList.contains('swiper-slide'));

  const rows = [headerRow];

  slides.forEach(slide => {
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return;

    // -------- FIRST CELL: image and rating -------- //
    const imageBlock = card.querySelector('.seo-hotel-strip--image-block');
    let imageCell = [];
    if (imageBlock) {
      const img = imageBlock.querySelector('img');
      if (img) imageCell.push(img);
      // Add the rating badge if it has visible text
      const ratingBadge = imageBlock.querySelector('.seo-hotel-strip--rating');
      if (ratingBadge && ratingBadge.textContent.trim()) {
        imageCell.push(ratingBadge);
      }
    }
    if (imageCell.length === 1) imageCell = imageCell[0]; // If only img, pass just the img
    if (imageCell.length === 0) imageCell = '';

    // -------- SECOND CELL: text -------- //
    const info = card.querySelector('.seo-hotel-strip--info');
    const textCell = document.createElement('div');
    if (info) {
      // Title (render as <strong> for bold)
      const title = info.querySelector('.seo-hotel-strip--title-block--title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.appendChild(strong);
      }
      // Location and Stars
      const titleBlock = info.querySelector('.seo-hotel-strip--title-block--rating-hotel');
      if (titleBlock) {
        // Location
        const location = titleBlock.querySelector('.seo-hotel-strip--location span');
        if (location && location.textContent.trim()) {
          const locP = document.createElement('span');
          locP.textContent = location.textContent.trim();
          textCell.appendChild(document.createElement('br'));
          textCell.appendChild(locP);
        }
        // Stars
        const stars = titleBlock.querySelector('.seo-hotel-strip--stars');
        if (stars) {
          const starElements = stars.querySelectorAll('.icon-star_filled');
          if (starElements.length > 0) {
            const starSpan = document.createElement('span');
            starSpan.textContent = ' ' + '★'.repeat(starElements.length);
            textCell.appendChild(starSpan);
          }
        }
      }
      // Price Block
      const priceBlock = info.querySelector('.seo-hotel-strip--price-block');
      if (priceBlock) {
        // Old Price (if present and not empty)
        const actualPrice = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
        if (actualPrice && actualPrice.textContent.trim()) {
          const del = document.createElement('del');
          del.textContent = actualPrice.textContent.trim();
          textCell.appendChild(document.createElement('br'));
          textCell.appendChild(del);
        }
        // Main Price
        const hotelPrice = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
        if (hotelPrice && hotelPrice.innerHTML.trim()) {
          const priceP = document.createElement('span');
          priceP.innerHTML = hotelPrice.innerHTML.trim(); // includes span: /night
          textCell.appendChild(document.createElement('br'));
          textCell.appendChild(priceP);
        }
        // Taxes & Fees
        const taxBlock = priceBlock.querySelector('.seo-hotel-strip--price-block--tax');
        if (taxBlock && taxBlock.innerHTML.trim()) {
          const taxSpan = document.createElement('span');
          taxSpan.innerHTML = taxBlock.innerHTML.trim();
          textCell.appendChild(document.createElement('br'));
          textCell.appendChild(taxSpan);
        }
        // CTA (Book Button, always present)
        const ctaBtn = priceBlock.querySelector('.seo-hotel-strip--book-now-cta');
        if (ctaBtn && ctaBtn.textContent.trim()) {
          textCell.appendChild(document.createElement('br'));
          const strongBtn = document.createElement('strong');
          strongBtn.textContent = ctaBtn.textContent.trim();
          textCell.appendChild(strongBtn);
        }
      }
    }
    rows.push([imageCell, textCell]);
  });

  // 3. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
