/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ["Cards (cards9)"];

  // Find the main swiper-wrapper for the hotel cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all swiper-slide elements (each is a card)
  const slides = Array.from(swiperWrapper.children)
    .filter(slide => slide.classList.contains('swiper-slide'));

  const rows = [];

  slides.forEach((slide) => {
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return;

    // ----------- IMAGE CELL (first column) -----------
    let img = null;
    const imageBlock = card.querySelector('.seo-hotel-strip--image-block');
    if (imageBlock) {
      img = imageBlock.querySelector('img'); // reference the actual element in document
    }
    // If missing, cell is left blank per guidelines

    // ----------- TEXT CELL (second column) -----------
    const textCell = document.createElement('div');

    // Title (always a <strong> per example block)
    const title = card.querySelector('.seo-hotel-strip--title-block--title');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
    }
    // Location (if available)
    const locationSpan = card.querySelector('.seo-hotel-strip--location span');
    if (locationSpan && locationSpan.textContent.trim()) {
      const locDiv = document.createElement('div');
      locDiv.textContent = locationSpan.textContent.trim();
      textCell.appendChild(locDiv);
    }
    // Star rating
    const starsDiv = card.querySelector('.seo-hotel-strip--stars');
    if (starsDiv) {
      const starCount = starsDiv.querySelectorAll('.icon-star_filled').length;
      if (starCount > 0) {
        const stars = document.createElement('div');
        stars.textContent = '★'.repeat(starCount);
        textCell.appendChild(stars);
      }
    }
    // Rating (if present)
    const ratingBlock = imageBlock && imageBlock.querySelector('.seo-hotel-strip--rating');
    if (ratingBlock && ratingBlock.textContent.trim()) {
      const ratingDiv = document.createElement('div');
      ratingDiv.textContent = ratingBlock.textContent.trim();
      textCell.appendChild(ratingDiv);
    }
    // Price block
    const priceBlock = card.querySelector('.seo-hotel-strip--price-block');
    if (priceBlock) {
      // Actual price
      const actualPrice = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
      if (actualPrice && actualPrice.textContent.trim()) {
        const actualDiv = document.createElement('div');
        actualDiv.textContent = actualPrice.textContent.trim();
        textCell.appendChild(actualDiv);
      }
      // Main price and /night tag
      const hotelPrice = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
      if (hotelPrice && hotelPrice.textContent.trim()) {
        const priceDiv = document.createElement('div');
        priceDiv.innerHTML = hotelPrice.innerHTML;
        textCell.appendChild(priceDiv);
      }
      // Tax info
      const taxPrice = priceBlock.querySelector('.tax-price');
      const taxLabel = priceBlock.querySelector('.tax-label');
      if ((taxPrice && taxPrice.textContent.trim()) || (taxLabel && taxLabel.textContent.trim())) {
        const taxDiv = document.createElement('div');
        if (taxPrice && taxPrice.textContent.trim()) {
          taxDiv.textContent = taxPrice.textContent.trim() + ' ';
        }
        if (taxLabel && taxLabel.textContent.trim()) {
          taxDiv.textContent += taxLabel.textContent.trim();
        }
        textCell.appendChild(taxDiv);
      }
    }
    // CTA (Book button as text)
    const bookBtn = card.querySelector('.seo-hotel-strip--book-now-cta');
    if (bookBtn && bookBtn.textContent.trim()) {
      const ctaDiv = document.createElement('div');
      ctaDiv.textContent = bookBtn.textContent.trim();
      textCell.appendChild(ctaDiv);
    }

    // Add this card row
    rows.push([
      img || '',
      textCell
    ]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
