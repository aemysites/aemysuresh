/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the card content for each card
  function extractCardContent(cardEl) {
    // Image (first cell)
    const imageBlock = cardEl.querySelector('.seo-hotel-strip--image-block');
    let imageCell = null;
    if (imageBlock) {
      // Only the image itself
      const img = imageBlock.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text content (second cell)
    const infoBlock = cardEl.querySelector('.seo-hotel-strip--info');
    let textCell = document.createElement('div');
    if (infoBlock) {
      // Title
      const title = infoBlock.querySelector('.seo-hotel-strip--title-block--title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent;
        textCell.appendChild(h3);
      }
      // Location and stars
      const ratingHotel = infoBlock.querySelector('.seo-hotel-strip--title-block--rating-hotel');
      if (ratingHotel) {
        // Location
        const location = ratingHotel.querySelector('.seo-hotel-strip--location');
        if (location) {
          const pLoc = document.createElement('p');
          pLoc.textContent = location.textContent;
          textCell.appendChild(pLoc);
        }
        // Stars
        const stars = ratingHotel.querySelector('.seo-hotel-strip--stars');
        if (stars) {
          const starCount = stars.querySelectorAll('.icon-star_filled').length;
          if (starCount > 0) {
            const starSpan = document.createElement('span');
            starSpan.textContent = '★'.repeat(starCount);
            starSpan.style.color = '#f5c518';
            starSpan.style.marginLeft = '0.5em';
            textCell.appendChild(starSpan);
          }
        }
      }
      // Rating (e.g. 4.2/5 (783 reviews))
      const ratingBlock = cardEl.querySelector('.seo-hotel-strip--rating');
      if (ratingBlock) {
        const ratingSpan = document.createElement('p');
        ratingSpan.textContent = ratingBlock.textContent.trim();
        textCell.appendChild(ratingSpan);
      }
      // Price block
      const priceBlock = infoBlock.querySelector('.seo-hotel-strip--price-block');
      if (priceBlock) {
        // Actual price (strikethrough, if present)
        const actualPrice = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
        if (actualPrice && actualPrice.textContent.trim()) {
          const del = document.createElement('del');
          del.textContent = actualPrice.textContent.trim();
          textCell.appendChild(del);
        }
        // Main price
        const hotelPrice = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
        if (hotelPrice) {
          const p = document.createElement('p');
          p.innerHTML = hotelPrice.innerHTML;
          textCell.appendChild(p);
        }
        // Taxes
        const taxBlock = priceBlock.querySelector('.seo-hotel-strip--price-block--tax');
        if (taxBlock) {
          const p = document.createElement('p');
          p.innerHTML = taxBlock.innerHTML;
          textCell.appendChild(p);
        }
      }
      // CTA Button
      const cta = infoBlock.querySelector('.seo-hotel-strip--book-now-cta');
      if (cta) {
        // We'll create a link styled as a button
        const btn = document.createElement('a');
        btn.textContent = cta.textContent;
        btn.href = '#';
        btn.className = 'button';
        textCell.appendChild(btn);
      }
    }
    return [imageCell, textCell];
  }

  // Find all cards
  // The cards are inside .swiper-slide > .seo-hotel-strip--item
  const swiper = element.querySelector('.swiper-wrapper');
  if (!swiper) return;
  const slides = swiper.querySelectorAll('.swiper-slide');
  if (!slides.length) return;

  // Build table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Cards (cards10)']);

  slides.forEach((slide) => {
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (card) {
      const [imageCell, textCell] = extractCardContent(card);
      if (imageCell && textCell) {
        rows.push([imageCell, textCell]);
      }
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
