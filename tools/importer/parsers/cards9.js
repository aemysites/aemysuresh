/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the swiper wrapper containing all cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all card slides
  const slides = swiperWrapper.querySelectorAll(':scope > .swiper-slide');
  if (!slides.length) return;

  // Table header as required
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide contains a hotel card
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return;

    // --- Image cell ---
    let imageCell = '';
    const imageBlock = card.querySelector('.seo-hotel-strip--image-block');
    if (imageBlock) {
      // Use the image element directly
      const img = imageBlock.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- Text cell ---
    const infoBlock = card.querySelector('.seo-hotel-strip--info');
    const textCellContent = [];
    if (infoBlock) {
      // Title
      const title = infoBlock.querySelector('.seo-hotel-strip--title-block--title');
      if (title) {
        // Use a heading for semantic meaning
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent;
        textCellContent.push(h3);
      }
      // Location (optional)
      const location = infoBlock.querySelector('.seo-hotel-strip--location span');
      if (location) {
        const locP = document.createElement('p');
        locP.textContent = location.textContent;
        textCellContent.push(locP);
      }
      // Star rating (optional)
      const stars = infoBlock.querySelector('.seo-hotel-strip--stars');
      if (stars && stars.children.length) {
        const starSpan = document.createElement('span');
        starSpan.textContent = '★'.repeat(stars.children.length);
        starSpan.style.color = '#FFD700';
        textCellContent.push(starSpan);
      }
      // Review rating (optional)
      const ratingBlock = card.querySelector('.seo-hotel-strip--rating');
      if (ratingBlock) {
        const ratingSpan = ratingBlock.querySelector('.seo-hotel-strip--rating--count');
        if (ratingSpan) {
          const reviewText = ratingSpan.textContent + ' ' + ratingBlock.textContent.replace(ratingSpan.textContent, '').trim();
          const reviewP = document.createElement('p');
          reviewP.textContent = reviewText;
          textCellContent.push(reviewP);
        }
      }
      // Price block
      const priceBlock = infoBlock.querySelector('.seo-hotel-strip--price-block');
      if (priceBlock) {
        // Actual price (optional)
        const actualPrice = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
        if (actualPrice && actualPrice.textContent.trim()) {
          const priceP = document.createElement('p');
          priceP.textContent = actualPrice.textContent.trim();
          textCellContent.push(priceP);
        }
        // Hotel price (mandatory)
        const hotelPrice = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
        if (hotelPrice) {
          const priceP = document.createElement('p');
          priceP.innerHTML = hotelPrice.innerHTML;
          textCellContent.push(priceP);
        }
        // Taxes & fees
        const taxBlock = priceBlock.querySelector('.seo-hotel-strip--price-block--tax');
        if (taxBlock) {
          const taxP = document.createElement('p');
          taxP.innerHTML = taxBlock.innerHTML;
          textCellContent.push(taxP);
        }
      }
      // CTA button (optional)
      const cta = priceBlock ? priceBlock.querySelector('.seo-hotel-strip--book-now-cta') : null;
      if (cta) {
        // Convert button to a link for semantic export
        const link = document.createElement('a');
        link.textContent = cta.textContent;
        link.href = '#'; // No URL available
        link.setAttribute('style', 'display:inline-block;margin-top:8px;background:#1a237e;color:#fff;padding:8px 16px;border-radius:4px;text-decoration:none;');
        textCellContent.push(link);
      }
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
