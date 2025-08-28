/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards10)'];

  // Find the swiper-wrapper containing the slides
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  // Find all slides
  const slides = Array.from(wrapper.querySelectorAll('.swiper-slide'));

  // Helper: get stars as Unicode
  function getStars(starsDiv) {
    if (!starsDiv) return '';
    const count = starsDiv.querySelectorAll('.icon-star_filled').length;
    return count ? '★'.repeat(count) : '';
  }

  // Build rows
  const rows = slides.map(slide => {
    // Find card root
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return [null, null];

    // IMAGE CELL
    let imageEl = null;
    const imageBlock = card.querySelector('.seo-hotel-strip--image-block');
    if (imageBlock) {
      imageEl = imageBlock.querySelector('img');
    }

    // CONTENT CELL
    const infoBlock = card.querySelector('.seo-hotel-strip--info');
    const fragments = [];

    // Hotel Name (bold, as per example)
    let titleEl = null;
    const titleBlock = infoBlock ? infoBlock.querySelector('.seo-hotel-strip--title-block') : null;
    if (titleBlock) {
      titleEl = titleBlock.querySelector('.seo-hotel-strip--title-block--title');
      if (titleEl) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent;
        fragments.push(strong);
      }
    }

    // Location and stars (inline, small)
    if (titleBlock) {
      const loc = titleBlock.querySelector('.seo-hotel-strip--location');
      const location = loc ? loc.textContent.trim() : '';
      const starsDiv = titleBlock.querySelector('.seo-hotel-strip--stars');
      const stars = getStars(starsDiv);
      if (location || stars) {
        const meta = document.createElement('div');
        meta.style.fontSize = 'smaller';
        meta.textContent = [location, stars].filter(Boolean).join(' ');
        fragments.push(meta);
      }
    }

    // Rating (e.g. "4/5 (926 reviews)")
    let ratingText = '';
    if (imageBlock) {
      const ratingDiv = imageBlock.querySelector('.seo-hotel-strip--rating');
      if (ratingDiv) {
        const ratingCount = ratingDiv.querySelector('.seo-hotel-strip--rating--count');
        ratingText = ratingDiv.textContent.trim();
        if (ratingCount && ratingCount.textContent && ratingDiv.textContent.indexOf(ratingCount.textContent) === 0) {
          ratingText = ratingCount.textContent + ' ' + ratingDiv.textContent.slice(ratingCount.textContent.length).trim();
        }
        if (ratingText) {
          const ratingEl = document.createElement('div');
          ratingEl.style.fontSize = 'smaller';
          ratingEl.textContent = ratingText;
          fragments.push(ratingEl);
        }
      }
    }

    // Price info
    const priceBlock = infoBlock ? infoBlock.querySelector('.seo-hotel-strip--price-block') : null;
    if (priceBlock) {
      const priceWrapper = priceBlock.querySelector('.seo-hotel-strip--price-block--wrapper');
      if (priceWrapper) {
        // Actual price
        const actualPriceP = priceWrapper.querySelector('.seo-hotel-strip--price-block--actual-price');
        let priceText = '';
        if (actualPriceP && actualPriceP.textContent.trim()) {
          priceText = actualPriceP.textContent.trim();
        }
        // Hotel price and night tag
        const hotelPriceDiv = priceWrapper.querySelector('.seo-hotel-strip--hotel-price');
        if (hotelPriceDiv) {
          let hotelPriceText = hotelPriceDiv.textContent.trim();
          const nightSpan = hotelPriceDiv.querySelector('.seo-hotel-strip--price-block--night-tag');
          let nightText = '';
          if (nightSpan) {
            nightText = nightSpan.textContent.trim();
            hotelPriceText = hotelPriceText.replace(nightText, '').trim();
          }
          priceText = [priceText, hotelPriceText, nightText].filter(Boolean).join(' ');
        }
        if (priceText) {
          const priceEl = document.createElement('div');
          priceEl.textContent = priceText;
          fragments.push(priceEl);
        }
        // Tax info
        const taxDiv = priceWrapper.querySelector('.seo-hotel-strip--price-block--tax');
        if (taxDiv) {
          const taxPrice = taxDiv.querySelector('.tax-price');
          const taxLabel = taxDiv.querySelector('.tax-label');
          const taxText = [taxPrice ? taxPrice.textContent.trim() : '', taxLabel ? taxLabel.textContent.trim() : ''].filter(Boolean).join(' ');
          if (taxText) {
            const taxEl = document.createElement('div');
            taxEl.style.fontSize = 'smaller';
            taxEl.textContent = taxText;
            fragments.push(taxEl);
          }
        }
        // CTA button (convert to link, use text content, href="#")
        const ctaBtn = priceBlock.querySelector('.seo-hotel-strip--book-now-cta');
        if (ctaBtn) {
          const link = document.createElement('a');
          link.textContent = ctaBtn.textContent;
          link.href = '#';
          fragments.push(link);
        }
      }
    }

    return [imageEl, fragments];
  });

  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
