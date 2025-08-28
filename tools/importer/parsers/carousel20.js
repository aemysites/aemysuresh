/* global WebImporter */
export default function parse(element, { document }) {
  // The block header, from the example
  const headerRow = ['Carousel (carousel20)'];
  const cells = [headerRow];

  // Extract image slides (city avatars)
  const avatarSwiper = element.querySelector('.discover__destination__stories .swiper-wrapper');
  // Extract city detail info for each slide
  const storyViewSwiper = element.querySelector('.story__view .swiper-wrapper');

  if (avatarSwiper && storyViewSwiper) {
    const avatarSlides = Array.from(avatarSwiper.querySelectorAll('.swiper-slide'));
    const detailSlides = Array.from(storyViewSwiper.querySelectorAll('.swiper-slide'));

    // Loop through all slides, matching each avatar to its detail info
    for (let i = 0; i < avatarSlides.length && i < detailSlides.length; i++) {
      const avatar = avatarSlides[i];
      const detail = detailSlides[i];
      // IMAGE CELL (always required)
      let imgEl = null;
      const avatarBg = avatar.querySelector('.slide-content');
      if (avatarBg) {
        const imgUrl = avatarBg.getAttribute('data-bg-image');
        const imgAlt = avatarBg.getAttribute('title') || '';
        if (imgUrl) {
          // Create an img referencing the source
          imgEl = document.createElement('img');
          imgEl.src = imgUrl;
          imgEl.alt = imgAlt;
          imgEl.title = imgAlt;
        }
      }
      // TEXT CELL (all content from .trip-info, including heading, description, and links)
      let contentArr = [];
      const tripInfo = detail.querySelector('.trip-info');
      if (tripInfo) {
        // Heading - use <h2> to retain semantic meaning
        const heading = tripInfo.querySelector('h5');
        if (heading && heading.textContent.trim()) {
          const h2 = document.createElement('h2');
          h2.textContent = heading.textContent.trim();
          contentArr.push(h2);
        }
        // Description - use <p>
        const desc = tripInfo.querySelector('p.description');
        if (desc && desc.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          contentArr.push(p);
        }
        // Add all CTAs/buttons in order as they appear
        const ctaLinks = tripInfo.querySelectorAll('a');
        ctaLinks.forEach(link => {
          contentArr.push(link);
        });
      }
      // Add the row, with always an image, and text cell if contentArr is not empty
      cells.push([
        imgEl,
        contentArr.length > 0 ? contentArr : ''
      ]);
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
