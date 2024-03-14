const {existsSync, writeFileSync} = require('fs');

const {PNG} = require('pngjs');

const {DICOM_TAG_DICTIONARY} = require('../data/dicom-tag-dict');

const DEFAULT_WINDOW_CENTER = 128;
const DEFAULT_WINDOW_WIDTH = 256;

/**
 * Service for reading DICOM files and tags
 */
class DICOMViewerService {
  /**
   *
   * @param {object} deps Injected dependencies
   * @param {import('./dicom-reader-service').DICOMReaderService} deps.dicomReaderService The DICOM reader service
   */
  constructor(deps = {}) {
    this.dicomReaderService = deps.dicomReaderService;
  }

  /**
   * View DICOMFile as a PNG
   *
   * @param {import('../models/dicom-file').DICOMFile} file The DICOM file
   *
   * @returns
   */
  viewAsPNG(file) {
    const pngPath = this.getPNGPath(file);

    if (this.hasCachedPNG(pngPath)) {
      return {path: pngPath, cached: true};
    }

    this.createPNG(pngPath, file);

    return {path: pngPath, cached: false};
  }

  /**
   * Create a PNG version of the DICOM file
   *
   * @param {string} path The PNG file path
   * @param {import('../models/dicom-file').DICOMFile} file The DICOM file
   *
   * @returns {string} The PNG file path
   */
  createPNG(path, file) {
    const dataSet = this.dicomReaderService.parseDICOMFile(file.url);
    const pixelDataElement = dataSet.elements[DICOM_TAG_DICTIONARY.PixelData];
    const pixelData = new Uint16Array(
      dataSet.byteArray.buffer,
      pixelDataElement.dataOffset,
      pixelDataElement.length / 2,
    );

    const width = dataSet.uint16(DICOM_TAG_DICTIONARY.Columns);
    const height = dataSet.uint16(DICOM_TAG_DICTIONARY.Rows);
    let windowCenter = parseFloat(
      dataSet.string(DICOM_TAG_DICTIONARY.WindowCenter),
    );
    let windowWidth = parseFloat(
      dataSet.string(DICOM_TAG_DICTIONARY.WindowWidth),
    );
    windowCenter = isNaN(windowCenter) ? DEFAULT_WINDOW_CENTER : windowCenter;
    windowWidth = isNaN(windowWidth) ? DEFAULT_WINDOW_WIDTH : windowWidth;

    const png = new PNG({width, height, filterType: -1});

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = width * y + x;
        const pixelValue = pixelData[idx];
        let intensity = 0;

        if (pixelValue <= windowCenter - 0.5 - (windowWidth - 1) / 2) {
          // Black
          intensity = 0;
        } else if (pixelValue > windowCenter - 0.5 + (windowWidth - 1) / 2) {
          // White
          intensity = 255;
        } else {
          // Gray
          intensity =
            ((pixelValue - (windowCenter - 0.5)) / (windowWidth - 1) + 0.5) *
            255;
        }

        const pngIdx = idx << 2;
        png.data[pngIdx] = intensity;
        png.data[pngIdx + 1] = intensity;
        png.data[pngIdx + 2] = intensity;
        // Fully opaque
        png.data[pngIdx + 3] = 0xff;
      }
    }

    const pngBuffer = PNG.sync.write(png);

    writeFileSync(path, pngBuffer);

    return path;
  }

  /**
   * Builds file path for PNG from DICOM file
   *
   * @param {import('../models/dicom-file').DICOMFile} file The DICOM file
   *
   * @returns {string} The PNG file path
   */
  getPNGPath(file) {
    return `${file.url}-${file.checksum}.png`;
  }

  /**
   * Checks if the PNG already exists in cache
   *
   * @param {string} path The PNG file path
   *
   * @returns {boolean} Whether the PNG exists in cache or not
   */
  hasCachedPNG(path) {
    return existsSync(path);
  }
}

module.exports = {DICOMViewerService};
