/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.querySelectorAll(':scope > .swiper-slide'));
  const rows = [headerRow];
  slides.forEach(slide => {
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return;
    // 1st cell: Image
    let imageEl = null;
    const imgBlock = card.querySelector('.seo-hotel-strip--image-block');
    if (imgBlock) {
      imageEl = imgBlock.querySelector('img');
    }
    // 2nd cell: Text
    const infoBlock = card.querySelector('.seo-hotel-strip--info');
    const textContent = [];
    if (infoBlock) {
      // Title
      const titleEl = infoBlock.querySelector('.seo-hotel-strip--title-block--title');
      if (titleEl && titleEl.textContent.trim()) {
        const heading = document.createElement('strong');
        heading.textContent = titleEl.textContent.trim();
        textContent.push(heading);
      }
      // Location & stars
      const ratingBlock = infoBlock.querySelector('.seo-hotel-strip--title-block--rating-hotel');
      if (ratingBlock) {
        // Location
        const locationEl = ratingBlock.querySelector('.seo-hotel-strip--location span');
        if (locationEl && locationEl.textContent.trim()) {
          const locDiv = document.createElement('div');
          locDiv.textContent = locationEl.textContent.trim();
          textContent.push(locDiv);
        }
        // Stars
        const starsEl = ratingBlock.querySelector('.seo-hotel-strip--stars');
        if (starsEl) {
          const starCount = starsEl.querySelectorAll('.icon-star_filled').length;
          if (starCount) {
            const starsDiv = document.createElement('div');
            starsDiv.textContent = '★'.repeat(starCount);
            textContent.push(starsDiv);
          }
        }
      }
      // Rating (e.g. 4.2/5 (783 reviews))
      if (imgBlock) {
        const ratingEl = imgBlock.querySelector('.seo-hotel-strip--rating');
        if (ratingEl && ratingEl.textContent.trim()) {
          const ratingDiv = document.createElement('div');
          ratingDiv.textContent = ratingEl.textContent.trim();
          textContent.push(ratingDiv);
        }
      }
      // Price info
      const priceBlock = infoBlock.querySelector('.seo-hotel-strip--price-block');
      if (priceBlock) {
        const priceWrapper = priceBlock.querySelector('.seo-hotel-strip--price-block--wrapper');
        if (priceWrapper) {
          // Actual price (if present and non-empty)
          const actualPriceEl = priceWrapper.querySelector('.seo-hotel-strip--price-block--actual-price');
          if (actualPriceEl && actualPriceEl.textContent.trim()) {
            textContent.push(actualPriceEl);
          }
          // Hotel price (main price)
          const hotelPriceEl = priceWrapper.querySelector('.seo-hotel-strip--hotel-price');
          if (hotelPriceEl) {
            textContent.push(hotelPriceEl);
          }
          // Tax info
          const taxBlock = priceWrapper.querySelector('.seo-hotel-strip--price-block--tax');
          if (taxBlock) {
            textContent.push(taxBlock);
          }
        }
        // CTA Button (Book)
        const ctaBtn = priceBlock.querySelector('.seo-hotel-strip--book-now-cta');
        if (ctaBtn && ctaBtn.textContent.trim()) {
          const ctaSpan = document.createElement('span');
          ctaSpan.textContent = ctaBtn.textContent.trim();
          textContent.push(ctaSpan);
        }
      }
    }
    // Compose row
    rows.push([imageEl, textContent]);
  });
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
