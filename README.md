# PDFTron-Image-Extractor

This Tampermonkey script automatically detects and downloads images from PDFTron-based viewers (specifically tested on platforms like `pdftron-viewer-quasar.pro.iberley.net`) that match a user-defined regular expression. The script downloads these images into a specified subfolder within your browser's default download directory.

## Features

* **Automatic Image Detection:** Identifies images based on a configurable regular expression pattern.
* **Subfolder Organization:** Downloads images into a specified subfolder for better organization.
* **Background Downloading:** Downloads images in the background without interrupting your Browse.
* **Configuration Options:** Allows users to customize the download subfolder and the image URL matching pattern.

## How to Use

1.  **Install Tampermonkey:** If you don't have it already, install the Tampermonkey browser extension for your browser (Chrome, Firefox, etc.).
2.  **Install the Script:**
    * Go to the URL where you have the script code (e.g., a raw paste or your local file).
    * Tampermonkey should automatically detect the script and prompt you to install it. Click "Install".
3.  **Browse PDFTron Viewer:** Navigate to a PDF document on a supported PDFTron-based viewer (like `https://pdftron-viewer-quasar.pro.iberley.net/*`).
4.  **Automatic Downloading:** The script will automatically start detecting and downloading images that match the default pattern (`/pageimg\d+\.jpg/i`) into a subfolder named `PDFTron_Images` in your Downloads folder.

## Configuration

You can configure the script to change the download subfolder and the image URL matching pattern. There are two ways to do this:

**Method 1: Via Tampermonkey Settings (Recommended due to a known issue)**

1.  Click on the Tampermonkey extension icon in your browser.
2.  Go to the Tampermonkey Dashboard.
3.  Find the "PDFTron Image Extractor Pro" script in the list.
4.  Click on the "Settings" tab (usually represented by a gear icon).
5.  You will find the following settings that you can modify:
    * `destinationFolder`: The name of the subfolder where images will be saved (default: `PDFTron_Images`).
    * `pdfTronImagePattern`: The regular expression used to match image URLs (default: `/pageimg\d+\.jpg/i`).

**Method 2: Via the Script's Configuration Menu (Known Issue)**

The script is intended to provide an on-page configuration menu with buttons to "Change Subfolder" and "Configure Image Pattern". However, there is a known issue where this configuration UI might not always appear correctly. If it does appear:

1.  Click on the "Change Subfolder" button to enter a new name for the download subfolder.
2.  Click on the "Configure Image Pattern" button to enter a new regular expression for matching image URLs.

**Known Issues:**

* **Configuration UI Not Always Appearing:** The configuration UI with the "Change Subfolder" and "Configure Image Pattern" buttons might not always be created on the page. In this case, please use **Method 1** (via Tampermonkey settings) to configure the script.
* **Multiple Configuration Prompts:** When attempting to configure the script using the on-page menu (if it appears), you might be prompted multiple times (2-3 times) to enter the subfolder name or image pattern. Please enter your desired value each time. This is a known issue and is being investigated.

## Contributing

If you have any suggestions, bug reports, or would like to contribute to the script, please feel free to open an issue or submit a pull request on this repository.

## License

MIT License
