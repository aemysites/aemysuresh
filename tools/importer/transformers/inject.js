/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-console */
(() => {
  try {
    // remove site header
    document.querySelector('.headerv2')?.remove();

    // Remove site footer
    document.querySelector('.footerv2')?.remove();

    // remove accept cookie banner
    document.querySelector('.cookies')?.remove();

    // remove chat widget
    document.querySelector('.chat-widget')?.remove();

    // remove back to top button
    document.querySelector('.back-to-top')?.remove();

    // remove share container
    document.querySelector('.share-container')?.remove();
  } catch (e) {
    // noop
  }
})();
