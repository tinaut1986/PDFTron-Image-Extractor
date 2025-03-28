# PDFTron Image Extractor

This Tampermonkey script allows users to manually detect and download images from PDFTron-based viewers (specifically tested on platforms like `pdftron-viewer-quasar.pro.iberley.net`) that match a user-defined pattern. The script runs within the PDFTron viewer's iframe and provides an on-page control panel to manage the download process and configuration. Downloaded images are saved into a specified subfolder within your browser's default download directory.

## Features

*   **Manual Start/Stop Control:** Users explicitly start and stop the image detection and download process via an on-page button.
*   **On-Page Control Panel:** Provides buttons to Start/Stop downloads, configure the subfolder and configure the image pattern.
*   **Configurable Image Pattern:** Allows users to define a pattern (using simple text or regular expressions) to accurately target the desired image URLs (e.g., matching page numbers).
*   **Subfolder Organization:** Downloads images into a user-specified subfolder within the browser's main download location for easy organization.
*   **Targeted Execution:** Runs specifically within the PDFTron WebViewer UI iframe to avoid conflicts and ensure controls appear in the correct context.
*   **On-Demand Background Downloading:** When active, downloads images in the background as they are detected.
*   **Cache Detection:** Attempts to detect and download images that might have already been loaded into the browser cache when the download process starts.

## How to Use

1.  **Install Tampermonkey:** If you haven't already, install the Tampermonkey browser extension for your browser (Chrome, Firefox, Edge, Safari, etc.).
2.  **Install the Script:**
    *   Navigate to the script's installation URL (e.g., GreasyFork, GitHub raw file) or open the `.user.js` file in your browser.
    *   Tampermonkey should automatically detect the script and prompt you to install it. Review the permissions and click "Install".
3.  **Browse to the PDFTron Viewer:** Go to a page containing the embedded PDFTron viewer (e.g., `https://pdftron-viewer-quasar.pro.iberley.net/...`). The viewer itself often loads within an iframe.
4.  **Locate the Control Panel:** Look for the "PDFTron Extractor" control panel in the **top-right corner of the PDF viewer frame**.
5.  **(Optional) Configure:**
    *   Click the **"Folder"** button to set the name of the subfolder where images will be saved (relative to your browser's main download location).
    *   Click the **"Pattern"** button to define the pattern used to identify image URLs. The default (`/pageimg\d+\.jpg/i`) usually works for page images named like `pageimg0.jpg`, `pageimg1.jpg`, etc.
6.  **Start Downloading:** Click the **"▶️ Start Download"** button. The status will change to "Active".
7.  **Load Images:** Scroll through the document in the viewer. As images matching the pattern are loaded or detected in the cache, the script will attempt to download them to the specified subfolder. The "Downloaded" count in the status panel will update.
8.  **Stop Downloading:** When you have scrolled through the necessary pages or wish to stop, click the **"⏹️ Stop Download"** button. The status will change to "Idle".

## Configuration

Configuration is done directly through the script's control panel located within the PDF viewer frame:

*   **Folder Button:**
    *   Prompts you to enter a name for the subfolder.
    *   This folder will be created inside your browser's primary download directory (e.g., inside `C:\Users\YourUser\Downloads` or `~/Downloads`).
    *   Defaults to `PDFTron_Images`.
*   **Pattern Button:**
    *   Prompts you to enter a pattern to match the image URLs.
    *   For simple cases, you might just need part of the filename.
    *   For more complex matching (like page numbers), you'll use a format called a "regular expression". The default `/pageimg\d+\.jpg/i` is an example:
        *   `/`: Start and end markers for the pattern.
        *   `pageimg`: Matches the literal text "pageimg".
        *   `\d+`: Matches one or more digits (0-9).
        *   `\.`: Matches a literal dot (`.` normally means "any character").
        *   `jpg`: Matches the literal text "jpg".
        *   `i`: Makes the whole pattern case-insensitive.
    *   If you change the pattern while downloads are active, the process will restart automatically.

## Contributing

Suggestions, bug reports, and contributions are welcome! Please feel free to open an issue or submit a pull request if this script is hosted on a platform like GitHub.

## License

MIT License

Copyright (c) 2025 Tinaut1986

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.