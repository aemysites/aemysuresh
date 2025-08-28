/* global WebImporter */
export default function parse(element, { document }) {
  // --- Gather columns ---
  // Accordion containers (menus)
  const details = element.querySelector('.details');
  let accordionBlocks = [];
  if (details) {
    const accordion = details.querySelector('.accordion');
    if (accordion) {
      accordionBlocks = Array.from(accordion.querySelectorAll(':scope > .accordion_container'));
    }
  }
  // Awards column
  let awardsSection = null;
  if (details) {
    awardsSection = details.querySelector('.awards-section');
  }
  // Social links & Download app columns
  const socialLinks = element.querySelector('.social-links');
  let socialMediaIcons = null, downloadAppIcons = null;
  if (socialLinks) {
    const iconsSections = socialLinks.querySelectorAll(':scope > .social-links_icons');
    if (iconsSections.length > 0) socialMediaIcons = iconsSections[0];
    if (iconsSections.length > 1) downloadAppIcons = iconsSections[1];
  }
  // Build columns
  // Menus: 4 menus (COMPANY, SUPPORT, QUICK LINKS, MEDIA)
  // Then: awards, social, app (for a total of 7 columns)
  const columns = [...accordionBlocks];
  if (awardsSection) columns.push(awardsSection); else columns.push(document.createElement('div'));
  if (socialMediaIcons) columns.push(socialMediaIcons); else columns.push(document.createElement('div'));
  if (downloadAppIcons) columns.push(downloadAppIcons); else columns.push(document.createElement('div'));

  // --- Construct the block table ---
  // Header row is a single cell (not as many columns as columns.length!)
  const cells = [
    ['Columns (columns4)'], // header: single cell
    columns                 // content: one cell per column
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
