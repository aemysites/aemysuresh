/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards10)'];

  // Find all card slides
  const slides = element.querySelectorAll('.swiper-slide');
  const rows = [headerRow];

  slides.forEach(slide => {
    // Card root
    const card = slide.querySelector('.seo-hotel-strip--item');
    if (!card) return;

    // IMAGE CELL
    const imgBlock = card.querySelector('.seo-hotel-strip--image-block');
    let imageCell = [];
    // Image
    if (imgBlock) {
      const img = imgBlock.querySelector('img');
      if (img) imageCell.push(img);
      // Rating (as badge-like, below image)
      const ratingDiv = imgBlock.querySelector('.seo-hotel-strip--rating');
      if (ratingDiv && ratingDiv.textContent.trim()) {
        const ratingPara = document.createElement('p');
        ratingPara.appendChild(ratingDiv);
        imageCell.push(ratingPara);
      }
    }
    if (imageCell.length === 1) imageCell = imageCell[0];
    
    // TEXT CELL
    let textCell = [];
    // Title (as strong)
    const titleEl = card.querySelector('.seo-hotel-strip--title-block--title');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCell.push(strong);
    }
    // Location and Stars
    const locationEl = card.querySelector('.seo-hotel-strip--location span');
    const starsEl = card.querySelector('.seo-hotel-strip--stars');
    if ((locationEl && locationEl.textContent.trim()) || starsEl) {
      const metaDiv = document.createElement('div');
      if (locationEl && locationEl.textContent.trim()) {
        metaDiv.appendChild(locationEl);
      }
      if (starsEl) {
        metaDiv.appendChild(starsEl);
      }
      textCell.push(metaDiv);
    }
    // Price (actual price and display price)
    const actualPriceEl = card.querySelector('.seo-hotel-strip--price-block--actual-price');
    if (actualPriceEl && actualPriceEl.textContent.trim()) {
      const actualPriceP = document.createElement('p');
      actualPriceP.textContent = actualPriceEl.textContent.trim();
      textCell.push(actualPriceP);
    }
    const hotelPriceEl = card.querySelector('.seo-hotel-strip--hotel-price');
    if (hotelPriceEl) {
      textCell.push(hotelPriceEl);
    }
    // Tax info
    const taxPriceEl = card.querySelector('.tax-price');
    const taxLabelEl = card.querySelector('.tax-label');
    if ((taxPriceEl && taxPriceEl.textContent.trim()) || (taxLabelEl && taxLabelEl.textContent.trim())) {
      const taxDiv = document.createElement('div');
      if (taxPriceEl && taxPriceEl.textContent.trim()) {
        taxDiv.appendChild(taxPriceEl);
      }
      if (taxLabelEl && taxLabelEl.textContent.trim()) {
        taxDiv.appendChild(taxLabelEl);
      }
      textCell.push(taxDiv);
    }
    // CTA Button
    const bookButton = card.querySelector('.seo-hotel-strip--book-now-cta');
    if (bookButton) {
      textCell.push(bookButton);
    }
    // If only one item, don't wrap in array
    if (textCell.length === 1) textCell = textCell[0];
    rows.push([imageCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
