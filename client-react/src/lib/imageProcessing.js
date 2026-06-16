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

    let previousWord = null;

    words.forEach(word => {
      const text = word.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      let blurBbox = null;
      let blurRatio = 0; // 0 means blur the whole bbox, >0 means keep the left side

      // Case 1: Tesseract read the entire plate as one word (e.g. KDA123A)
      if (/^K[A-Z]{2}[0-9]{3}[A-Z]?$/i.test(text) || (text.startsWith('K') && text.length >= 6 && text.length <= 8 && /\d{3}/.test(text))) {
        blurBbox = word.bbox;
        blurRatio = 0.42; // Keep first ~3 letters
      } 
      // Case 2: Tesseract split the plate into two words (e.g. "KDA" and "123A")
      else if (previousWord) {
        const prevText = previousWord.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (prevText.startsWith('K') && prevText.length === 3 && /^[0-9]{3}[A-Z]?$/i.test(text)) {
          blurBbox = word.bbox; // Blur the entire numbers segment
          blurRatio = 0.0; // Blur 100% of this word
        }
      }

      if (blurBbox) {
        blurred = true;
        
        const x0 = blurBbox.x0 / scale;
        const y0 = blurBbox.y0 / scale;
        const x1 = blurBbox.x1 / scale;
        const y1 = blurBbox.y1 / scale;
        
        const width = x1 - x0;
        const height = y1 - y0;
        
        const keepWidth = width * blurRatio;
        const blurX = x0 + keepWidth;
        const blurWidth = width - keepWidth;
        const padY = height * 0.2; 
        const padX = blurRatio === 0 ? width * 0.1 : 0; // pad sides if blurring whole word
        
        const finalX = Math.max(0, blurX - padX);
        const finalY = Math.max(0, y0 - padY);
        const finalWidth = blurWidth + (padX * 2);
        const finalHeight = height + (padY * 2);

        outCtx.save();
        outCtx.filter = 'blur(15px)';
        outCtx.drawImage(
          img,
          finalX, finalY, finalWidth, finalHeight,
          finalX, finalY, finalWidth, finalHeight
        );
        outCtx.restore();
        
        outCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        outCtx.fillRect(finalX, finalY, finalWidth, finalHeight);
      }
      
      previousWord = word;
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
