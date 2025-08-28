/* global WebImporter */
export default function parse(element, { document }) {
  // Find the swiper wrapper containing all the cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Find all card slides
  const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));
  const rows = [
    ['Cards (cards9)']
  ];

  slides.forEach((slide) => {
    const item = slide.querySelector('.seo-hotel-strip--item');
    if (!item) return;
    
    // === Column 1: Image ===
    let image = '';
    const imageBlock = item.querySelector('.seo-hotel-strip--image-block img');
    if (imageBlock) image = imageBlock;

    // === Column 2: Text content ===
    const textContent = [];
    const infoBlock = item.querySelector('.seo-hotel-strip--info');
    if (infoBlock) {
      // Title (strong, first line)
      const title = infoBlock.querySelector('.seo-hotel-strip--title-block--title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textContent.push(strong);
      }
      // Location and stars (as a single line beneath title)
      const location = infoBlock.querySelector('.seo-hotel-strip--location span');
      const starsBlock = infoBlock.querySelector('.seo-hotel-strip--stars');
      if (location || starsBlock) {
        const locStars = document.createElement('div');
        if (location) {
          locStars.textContent = location.textContent;
        }
        if (starsBlock) {
          // count filled stars
          const starCount = starsBlock.querySelectorAll('.icon-star_filled').length;
          if (starCount > 0) {
            // Add space if location present
            if (location) locStars.append(' ');
            // Add stars as unicode
            locStars.append('★'.repeat(starCount));
          }
        }
        if (locStars.textContent.trim() !== '') {
          textContent.push(locStars);
        }
      }
      // Rating (e.g. 4.2/5 (729 reviews))
      const ratingBlock = item.querySelector('.seo-hotel-strip--rating');
      if (ratingBlock) {
        const ratingCount = ratingBlock.querySelector('.seo-hotel-strip--rating--count');
        let ratingText = '';
        if (ratingCount) {
          ratingText = ratingCount.textContent;
          // get the reviews text node
          const reviewsNode = ratingCount.nextSibling;
          if (reviewsNode && reviewsNode.nodeType === 3) {
            ratingText += ' ' + reviewsNode.textContent.trim();
          }
        }
        if (ratingText.trim() !== '') {
          const div = document.createElement('div');
          div.textContent = ratingText.trim();
          textContent.push(div);
        }
      }
      // Price block
      const priceBlock = infoBlock.querySelector('.seo-hotel-strip--price-block');
      if (priceBlock) {
        // Actual price (struck out)
        const actualPrice = priceBlock.querySelector('.seo-hotel-strip--price-block--actual-price');
        if (actualPrice && actualPrice.textContent.trim()) {
          const strike = document.createElement('s');
          strike.textContent = actualPrice.textContent.trim();
          textContent.push(strike);
        }
        // Hotel price and /night
        const hotelPrice = priceBlock.querySelector('.seo-hotel-strip--hotel-price');
        if (hotelPrice && hotelPrice.textContent.trim()) {
          const priceDiv = document.createElement('div');
          priceDiv.textContent = hotelPrice.textContent.replace(/\s+/g, ' ').trim();
          textContent.push(priceDiv);
        }
        // Taxes label
        const taxBlock = priceBlock.querySelector('.seo-hotel-strip--price-block--tax');
        if (taxBlock && taxBlock.textContent.trim()) {
          const taxDiv = document.createElement('div');
          taxDiv.textContent = taxBlock.textContent.replace(/\s+/g, ' ').trim();
          textContent.push(taxDiv);
        }
        // CTA button (Book)
        const ctaBtn = priceBlock.querySelector('.seo-hotel-strip--book-now-cta');
        if (ctaBtn && ctaBtn.textContent.trim()) {
          const cta = document.createElement('span');
          cta.textContent = ctaBtn.textContent.trim();
          textContent.push(cta);
        }
      }
    }
    rows.push([
      image,
      textContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
