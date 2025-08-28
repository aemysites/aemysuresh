/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const header = ['Cards (cards9)'];

  // Find the swiper wrapper that holds all slides
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  const slides = swiperWrapper ? swiperWrapper.querySelectorAll('.swiper-slide') : [];

  const rows = [];

  slides.forEach(slide => {
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return;
    // === LEFT CELL: IMAGE ===
    let img = null;
    const imgBlock = card.querySelector('.seo-hotel-strip--image-block');
    if (imgBlock) {
      img = imgBlock.querySelector('img');
    }

    // === RIGHT CELL: TEXTUAL CONTENT ===
    let rightCellParts = [];

    // Title (always present)
    const title = card.querySelector('.seo-hotel-strip--title-block--title');
    if (title && title.textContent.trim() !== '') {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      rightCellParts.push(strong);
    }

    // Location (Delhi)
    const location = card.querySelector('.seo-hotel-strip--location span');
    if (location && location.textContent.trim() !== '') {
      const locDiv = document.createElement('div');
      locDiv.textContent = location.textContent.trim();
      rightCellParts.push(locDiv);
    }

    // Star rating (number of .icon-star_filled)
    const starBlock = card.querySelector('.seo-hotel-strip--stars');
    if (starBlock) {
      const stars = starBlock.querySelectorAll('.icon-star_filled');
      if (stars.length > 0) {
        const starsDiv = document.createElement('div');
        starsDiv.textContent = '★'.repeat(stars.length);
        rightCellParts.push(starsDiv);
      }
    }

    // Hotel review rating (e.g. 4.3/5 (7 reviews))
    const ratingBlock = imgBlock ? imgBlock.querySelector('.seo-hotel-strip--rating') : null;
    if (ratingBlock && ratingBlock.textContent.trim() !== '') {
      const ratingDiv = document.createElement('div');
      ratingDiv.textContent = ratingBlock.textContent.trim();
      rightCellParts.push(ratingDiv);
    }

    // Price details
    const priceBlock = card.querySelector('.seo-hotel-strip--price-block');
    if (priceBlock) {
      // Actual price (strikethrough/old price, may be empty)
      const actualPrice = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
      if (actualPrice && actualPrice.textContent.trim() !== '') {
        const actualPriceDiv = document.createElement('div');
        actualPriceDiv.textContent = actualPrice.textContent.trim();
        rightCellParts.push(actualPriceDiv);
      }
      // Current hotel price per night
      const hotelPrice = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
      if (hotelPrice && hotelPrice.textContent.trim() !== '') {
        const hotelPriceDiv = document.createElement('div');
        hotelPriceDiv.innerHTML = hotelPrice.innerHTML;
        rightCellParts.push(hotelPriceDiv);
      }
      // Taxes info
      const taxPrice = priceBlock.querySelector('.tax-price');
      const taxLabel = priceBlock.querySelector('.tax-label');
      if ((taxPrice && taxPrice.textContent.trim() !== '') || (taxLabel && taxLabel.textContent.trim() !== '')) {
        const taxesDiv = document.createElement('div');
        taxesDiv.textContent =
          (taxPrice && taxPrice.textContent.trim() !== '' ? taxPrice.textContent.trim() + ' ' : '') +
          (taxLabel && taxLabel.textContent.trim() !== '' ? taxLabel.textContent.trim() : '');
        rightCellParts.push(taxesDiv);
      }
    }

    // CTA (Book button, always present)
    const bookBtn = card.querySelector('.seo-hotel-strip--book-now-cta');
    if (bookBtn && bookBtn.textContent.trim() !== '') {
      const ctaDiv = document.createElement('div');
      ctaDiv.textContent = bookBtn.textContent.trim();
      rightCellParts.push(ctaDiv);
    }

    // Compose row: always 2 columns
    rows.push([img, rightCellParts]);
  });

  // Compose the whole table
  const tableArr = [header, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
