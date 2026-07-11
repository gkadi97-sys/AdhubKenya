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
    
    // Convert to grayscale and increase contrast to help Tesseract read plates better
    ocrCtx.filter = 'grayscale(100%) contrast(150%)';
    ocrCtx.drawImage(img, 0, 0, ocrCanvas.width, ocrCanvas.height);

    // Run OCR
    if (onProgress) onProgress('Scanning for number plates...');
    const { data: { lines, words } } = await Tesseract.recognize(
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

    // Identify words to blur
    const wordsToBlur = new Set();

    // Strategy 1: Check entire lines (handles spaces between letters and numbers)
    lines.forEach(line => {
      const lineText = line.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      // If the line contains something that looks like a Kenyan plate (e.g. KDA123A or KDA123)
      if (/K[A-Z]{2}[0-9]{3}[A-Z]?/i.test(lineText)) {
        line.words.forEach(word => wordsToBlur.add(word));
      }
    });

    // Strategy 2: Fallback to individual word checks
    let previousWord = null;
    words.forEach(word => {
      const text = word.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      
      // Full plate in one word or missing 'K'
      if (/^K[A-Z]{2}[0-9]{3}[A-Z]?$/i.test(text) || (text.length >= 5 && text.length <= 7 && /^[A-Z]{2,3}[0-9]{3}[A-Z]?$/.test(text))) {
        wordsToBlur.add(word);
      } 
      // Split plate (KDA and 123A)
      else if (previousWord) {
        const prevText = previousWord.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (prevText.startsWith('K') && prevText.length === 3 && /^[0-9]{3}[A-Z]?$/i.test(text)) {
          wordsToBlur.add(word);
          wordsToBlur.add(previousWord);
        }
      }
      previousWord = word;
    });

    // Apply blur to identified words
    wordsToBlur.forEach(word => {
      blurred = true;
      const text = word.text.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const bbox = word.bbox;
      
      // If the word contains the 'K' prefix, we try to keep it visible, otherwise blur entirely
      const blurRatio = text.startsWith('K') ? 0.35 : 0; 
      
      const x0 = bbox.x0 / scale;
      const y0 = bbox.y0 / scale;
      const x1 = bbox.x1 / scale;
      const y1 = bbox.y1 / scale;
      
      const width = x1 - x0;
      const height = y1 - y0;
      
      const keepWidth = width * blurRatio;
      const blurX = x0 + keepWidth;
      const blurWidth = width - keepWidth;
      const padY = height * 0.2; 
      const padX = blurRatio === 0 ? width * 0.1 : 0;
      
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
