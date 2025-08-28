/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header exactly as in example
  const headerRow = ['Cards (cards10)'];
  const cells = [headerRow];

  // Find all .swiper-slide direct children (each is a card)
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = Array.from(swiperWrapper.children).filter(c => c.classList.contains('swiper-slide'));

  slides.forEach((slide) => {
    // IMAGE cell: always in .seo-hotel-strip--image-block > img
    const imageBlock = slide.querySelector('.seo-hotel-strip--image-block');
    let img = imageBlock ? imageBlock.querySelector('img') : null;

    // TEXT content cell construction
    const textElements = [];
    const infoBlock = slide.querySelector('.seo-hotel-strip--info');
    if (infoBlock) {
      // TITLE as heading: .seo-hotel-strip--title-block--title
      const titleEl = infoBlock.querySelector('.seo-hotel-strip--title-block--title');
      if (titleEl && titleEl.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        textElements.push(strong);
      }

      // LOCATION and STARS
      const locationEl = infoBlock.querySelector('.seo-hotel-strip--location span');
      const starsEl = infoBlock.querySelector('.seo-hotel-strip--stars');
      if (locationEl || starsEl) {
        let locStars = '';
        if (locationEl && locationEl.textContent.trim()) {
          locStars += locationEl.textContent.trim();
        }
        if (starsEl) {
          const starCount = starsEl.querySelectorAll('.icon-star_filled').length;
          if (starCount) {
            locStars += (locStars ? ' ' : '') + Array(starCount).fill('★').join('');
          }
        }
        if (locStars) {
          const span = document.createElement('span');
          span.textContent = locStars;
          textElements.push(span);
        }
      }

      // RATING (e.g. 4.2/5 (729 reviews)), if present
      const ratingBlock = imageBlock ? imageBlock.querySelector('.seo-hotel-strip--rating') : null;
      if (ratingBlock && ratingBlock.textContent.trim()) {
        const small = document.createElement('small');
        small.textContent = ratingBlock.textContent.trim();
        textElements.push(small);
      }

      // PRICE details
      const priceBlock = infoBlock.querySelector('.seo-hotel-strip--price-block');
      let priceText = '';
      if (priceBlock) {
        // Actual Price (might be empty)
        const actualPriceEl = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
        if (actualPriceEl && actualPriceEl.textContent.trim()) {
          priceText += actualPriceEl.textContent.trim() + '\n';
        }
        // Main Hotel Price (always present)
        const hotelPriceEl = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
        if (hotelPriceEl && hotelPriceEl.textContent.trim()) {
          // Remove any extra whitespace
          priceText += hotelPriceEl.textContent.replace(/\s+/g, ' ').trim() + '\n';
        }
        // Tax details (if present)
        const taxPriceEl = priceBlock.querySelector('.tax-price');
        if (taxPriceEl && taxPriceEl.textContent.trim()) {
          priceText += taxPriceEl.textContent.trim() + ' ';
        }
        const taxLabelEl = priceBlock.querySelector('.tax-label');
        if (taxLabelEl && taxLabelEl.textContent.trim()) {
          priceText += taxLabelEl.textContent.trim();
        }
      }
      if (priceText.trim()) {
        const p = document.createElement('p');
        p.textContent = priceText.trim();
        textElements.push(p);
      }

      // CTA button (Book) as a link (no href available, so using '#')
      const bookBtn = infoBlock.querySelector('.seo-hotel-strip--book-now-cta');
      if (bookBtn && bookBtn.textContent.trim()) {
        const a = document.createElement('a');
        a.textContent = bookBtn.textContent.trim();
        a.href = '#';
        textElements.push(a);
      }
    }

    // If no image, keep cell empty
    cells.push([
      img || '',
      textElements
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
