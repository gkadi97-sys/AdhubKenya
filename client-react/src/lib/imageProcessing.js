import Tesseract from 'tesseract.js';

/**
 * Reads a File into an HTMLImageElement
 */
const fileToImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Processes an image file, looking for Kenyan number plates using Tesseract OCR.
 * Blurs the digits, keeping the first 3 letters visible.
 */
export const autoBlurLicensePlate = async (file, onProgress = null) => {
  try {
    const img = await fileToImage(file);
    
    // Scale down image for faster OCR processing
    const MAX_DIMENSION = 1200;
    let scale = 1;
    if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
      scale = MAX_DIMENSION / Math.max(img.width, img.height);
    }
    
    // Offscreen canvas for OCR
    const ocrCanvas = document.createElement('canvas');
    ocrCanvas.width = img.width * scale;
    ocrCanvas.height = img.height * scale;
    const ocrCtx = ocrCanvas.getContext('2d');
    ocrCtx.drawImage(img, 0, 0, ocrCanvas.width, ocrCanvas.height);

    // Run OCR
    if (onProgress) onProgress('Scanning for number plates...');
    const { data: { words } } = await Tesseract.recognize(
      ocrCanvas,
      'eng'
    );

    let blurred = false;

    // Original size canvas for final output
    const outCanvas = document.createElement('canvas');
    outCanvas.width = img.width;
    outCanvas.height = img.height;
    const outCtx = outCanvas.getContext('2d');
    outCtx.drawImage(img, 0, 0);

    // Kenyan Plate Pattern: KDA 123A, KCA 123, etc.
    const plateRegex = /^K[A-Z]{2}[0-9]{3}[A-Z]?$/i;

    words.forEach(word => {
      const text = word.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (plateRegex.test(text) || (text.startsWith('K') && text.length >= 6 && text.length <= 7)) {
        // We found a plate!
        blurred = true;
        
        // Bounding box from OCR (which is scaled)
        const bbox = word.bbox; 
        
        // Map back to original image scale
        const x0 = bbox.x0 / scale;
        const y0 = bbox.y0 / scale;
        const x1 = bbox.x1 / scale;
        const y1 = bbox.y1 / scale;
        
        const width = x1 - x0;
        const height = y1 - y0;
        
        // We want to keep the first 3 letters. 3/7 is ~42% of the width.
        // Also expand the box slightly vertically to cover the whole plate height
        const keepWidth = width * 0.42;
        const blurX = x0 + keepWidth;
        const blurWidth = width - keepWidth;
        const padY = height * 0.2; // 20% padding
        
        const finalY = Math.max(0, y0 - padY);
        const finalHeight = height + (padY * 2);

        // Apply a pixelated/blur effect using context filter
        outCtx.save();
        outCtx.filter = 'blur(15px)';
        
        // Draw the region over itself with blur
        outCtx.drawImage(
          img,
          blurX, finalY, blurWidth, finalHeight,
          blurX, finalY, blurWidth, finalHeight
        );
        outCtx.restore();
        
        // Add a semi-transparent black overlay to hide the numbers further
        outCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        outCtx.fillRect(blurX, finalY, blurWidth, finalHeight);
      }
    });

    if (!blurred) {
      return file; // No plates detected
    }

    if (onProgress) onProgress('Blurring complete...');

    // Convert canvas back to a File
    return new Promise((resolve) => {
      outCanvas.toBlob((blob) => {
        const newFile = new File([blob], file.name, {
          type: file.type || 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(newFile);
      }, file.type || 'image/jpeg', 0.9);
    });

  } catch (error) {
    console.error('ALPR Error:', error);
    return file; // If it fails, fallback to original to prevent blocking upload
  }
};
