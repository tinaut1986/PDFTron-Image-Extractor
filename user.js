// ==UserScript==
// @name PDFTron Image Extractor
// @namespace http://tampermonkey.net/
// @version 0.9
// @description Downloads images matching a pattern into a subfolder in Downloads, preventing multiple initializations
// @author Tinaut1986
// @match https://pdftron-viewer-quasar.pro.iberley.net/*
// @grant GM_download
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @connect pdftron.pro.iberley.net
// @run-at document-end
// ==/UserScript==

(function() {
'use strict';

const SCRIPT_KEY = 'hasRunPDFTronExtractor';
const SESSION_ID_KEY = 'pdfTronSessionId';
const IMAGE_PATTERN_KEY = 'pdfTronImagePattern';
const DEFAULT_IMAGE_PATTERN = /\/pageimg\d+\\.jpg/i;
const UI_ID = 'pdftron-downloader'; // ID of the UI element
const STATUS_ID = 'pdtron-status'; // ID of the status element
const LOAD_LISTENER_ATTACHED_KEY = 'pdfTronLoadListenerAttached';

const VERIFICATION_INTERVAL = 3000;
let latestImages = new Set();
let destinationFolder = GM_getValue('destinationFolder', 'PDFTron_Images');
let imagePattern = new RegExp(GM_getValue(IMAGE_PATTERN_KEY, DEFAULT_IMAGE_PATTERN.source), 'i'); // Load and create RegExp

// 1. Improved folder configuration
function configureFolder() {
  const message = `Enter the name of the subfolder (relative to Downloads):\nExample: PDFTron_Images\n\nIt will be saved in the browser's download folder.`;

  const newFolder = prompt(message, destinationFolder);
  if (newFolder === null) return;

  if (newFolder) {
    destinationFolder = newFolder.replace(/[\\/]/g, '');
    GM_setValue('destinationFolder', destinationFolder);
    updateInterface();
    log(`[PDFTron] Subfolder configured: ${destinationFolder}`);
  }
}

// 2. Configure Image Pattern
function configureImagePattern() {
  const message = `Enter the regular expression to match image URLs:\nExample: /pageimg\\d+\\.jpg/i`;
  const newPattern = prompt(message, imagePattern.source);
  if (newPattern === null) return;

  try {
    const testRegExp = new RegExp(newPattern, 'i'); // Basic test for validity
    imagePattern = testRegExp;
    GM_setValue(IMAGE_PATTERN_KEY, newPattern);
    log(`[PDFTron] Image pattern configured: ${newPattern}`);
    updateInterface(); // Update the UI after changing the pattern
  } catch (error) {
    log(`[PDFTron] Invalid regular expression: ${error.message}`, 'error');
    alert(`Invalid regular expression: ${error.message}`);
  }
}

// 3. Configuration menu
GM_registerMenuCommand('🛠️ Configure Subfolder', configureFolder);
GM_registerMenuCommand('🔍 Configure Image Pattern', configureImagePattern);

// 4. Improved logging system
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[PDFTron][${timestamp}] ${message}`;

  switch(type) {
    case 'error':
      console.error(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
}

// 5. Resource interception
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    if (imagePattern.test(entry.name)) {
      processImage(entry.name);
    }
  });
});
performanceObserver.observe({type: 'resource', buffered: true});

// 6. Periodic cache verification
async function verifyCache() {
  try {
    const keys = await caches.keys();
    for (const key of keys) {
      const cache = await caches.open(key);
      const requests = await cache.keys();
      requests.forEach(request => {
        if (imagePattern.test(request.url)) {
          processImage(request.url);
        }
      });
    }
  } catch (error) {
    log('Error verifying cache: ' + error.message, 'error');
  }
}
setInterval(verifyCache, VERIFICATION_INTERVAL);

// 7. Main image processing
async function processImage(url) {
  try {
    const name = url.split('/').pop().split('?')[0];

    if (latestImages.has(url)) return;
    latestImages.add(url);

    log(`Confirmed detection: ${name}`);

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': navigator.userAgent,
        'Accept': 'image/*',
        'Origin': location.origin,
        'Referer': location.href,
        'Cookie': document.cookie
      },
      responseType: 'blob',
      onload: function(response) {
        const blob = response.response;
        const objectURL = URL.createObjectURL(blob);
        const fullPath = `${destinationFolder}/${name}`;

        GM_download({
          url: objectURL,
          name: fullPath,
          saveAs: false,
          onload: () => {
            log(`✅ Successful download: ${fullPath}`);
            URL.revokeObjectURL(objectURL);
            console.log(`[PDFTron] latestImages size: ${latestImages.size}`); // Debugging line
            // Introduce a small delay before updating the interface
            setTimeout(updateInterface, 100);
          },
          onerror: (e) => {
            log(`❌ Download error: ${e.error} - ${fullPath}`, 'error');
          }
        });
      },
      onerror: (err) => log(`Request error: ${err.statusText}`, 'error')
    });
  } catch (e) {
    log(`Critical error: ${e.message}`, 'error');
  }
}

// 8. Updated user interface with logical counter to avoid duplicates
function createInterface() {
  if (document.getElementById(UI_ID)) {
    log(`[PDFTron] Control already exists, updating directly.`);
    updateInterface();
    return;
  }

  log(`[PDFTron] Creating new control...`);

  const style = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 999999;
    padding: 10px;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    font-family: Arial, sans-serif;
  `;

  const container = document.createElement('div');
  container.id = UI_ID;
  container.style = style;

  const title = document.createElement('h3');
  title.textContent = 'PDFTron Downloader';
  title.style.margin = '0 0 10px 0';
  title.style.fontSize = '16px';

  const folderButton = document.createElement('button');
  folderButton.textContent = 'Change Subfolder';
  folderButton.onclick = configureFolder;
  folderButton.style.marginRight = '5px';
  folderButton.style.padding = '5px 10px';

  const patternButton = document.createElement('button');
  patternButton.textContent = 'Configure Image Pattern';
  patternButton.onclick = configureImagePattern;
  patternButton.style.marginRight = '5px';
  patternButton.style.padding = '5px 10px';

  const status = document.createElement('div');
  status.id = STATUS_ID; // Use the constant for the ID
  status.style.marginTop = '10px';
  status.style.fontSize = '0.9em';
  console.log("[PDFTron] Status element created."); // Debugging log

  container.append(title, folderButton, patternButton, status);

  document.body.appendChild(container);

  updateInterface();
}

function updateInterface() {
  const statusElement = document.getElementById(STATUS_ID); // Use the constant here as well

  if (statusElement) {
    statusElement.textContent = `Subfolder: ${destinationFolder}\nImage Pattern: ${imagePattern.source}\nDownloaded: ${latestImages.size}`;
    log(`[PDFTron] Interface updated successfully.`);
  } else {
    console.log("[PDFTron] Error updating interface, status element is null."); // More specific error log
    log(`[PDFTron] Error updating interface, status element not found.`, 'error');
  }
}

// Initialization
const loadListenerAlreadyAttached = GM_getValue(LOAD_LISTENER_ATTACHED_KEY, false);

if (!loadListenerAlreadyAttached) {
  GM_setValue(LOAD_LISTENER_ATTACHED_KEY, true);
  window.addEventListener('load', () => {
    console.log("[PDFTron] window.load event fired."); // Debugging log
    log('[PDFTron] Script started.'); // Moved script started log here
    let hasRun = GM_getValue(SCRIPT_KEY, false);
    let sessionId = GM_getValue(SESSION_ID_KEY, null);
    const currentSessionId = sessionStorage.getItem('pdfTronSessionId') || Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('pdfTronSessionId', currentSessionId);
    console.log(`[PDFTron] Initial hasRun value: ${hasRun}`); // Debugging log

    if (!hasRun) {
      console.log("[PDFTron] Creating interface..."); // Debugging log
      GM_setValue(SCRIPT_KEY, true);
      GM_setValue(SESSION_ID_KEY, currentSessionId);
      createInterface();
      log('[PDFTron] Script initialized after page load.');
    } else {
      log('[PDFTron] Script will not re-initialize after page load.');
    }
  });
} else {
  console.log("[PDFTron] window.load listener already attached.");
}
})();
