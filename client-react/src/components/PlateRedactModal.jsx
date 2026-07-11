import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Check, RotateCcw, Eye, EyeOff } from 'lucide-react';

/**
 * PlateRedactModal
 * Lets the user draw a rectangle over the number plate of a vehicle photo.
 * On confirm, returns a new File with that region blurred/redacted.
 */
export default function PlateRedactModal({ file, previewUrl, onConfirm, onCancel }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rect, setRect] = useState(null); // { x, y, w, h } in canvas coords
  const [startPt, setStartPt] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [scale, setScale] = useState({ x: 1, y: 1 }); // canvas px → image px ratio

  const drawCanvas = useCallback((currentRect) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (currentRect) {
      const { x, y, w, h } = currentRect;
      // Redact the selected region completely in preview
      ctx.save();
      ctx.fillStyle = '#0f172a'; // solid slate-900
      ctx.fillRect(x, y, w, h);
      // Draw a border
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(x, y, w, h);
      // Label
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('PLATE HIDDEN', x + 6, y + 16);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Fit canvas to container width while maintaining aspect ratio
      const maxW = Math.min(window.innerWidth - 48, 780);
      const ratio = Math.min(maxW / img.naturalWidth, 500 / img.naturalHeight);
      canvas.width = img.naturalWidth * ratio;
      canvas.height = img.naturalHeight * ratio;
      setScale({ x: img.naturalWidth / canvas.width, y: img.naturalHeight / canvas.height });
      drawCanvas(null);
    };
    img.src = previewUrl;
  }, [previewUrl, drawCanvas]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - bounds.left) * (canvas.width / bounds.width),
      y: (clientY - bounds.top) * (canvas.height / bounds.height),
    };
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    setStartPt(pos);
    setRect(null);
    setIsDrawing(true);
  };

  const onPointerMove = (e) => {
    e.preventDefault();
    if (!isDrawing || !startPt) return;
    const pos = getPos(e);
    const r = {
      x: Math.min(startPt.x, pos.x),
      y: Math.min(startPt.y, pos.y),
      w: Math.abs(pos.x - startPt.x),
      h: Math.abs(pos.y - startPt.y),
    };
    setRect(r);
    drawCanvas(r);
  };

  const onPointerUp = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const handleClear = () => {
    setRect(null);
    drawCanvas(null);
  };

  const handleConfirm = async () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    // Draw the final output at FULL resolution
    const outCanvas = document.createElement('canvas');
    outCanvas.width = img.naturalWidth;
    outCanvas.height = img.naturalHeight;
    const ctx = outCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    if (rect && rect.w > 5 && rect.h > 5) {
      // Scale rect back to image coordinates
      const sx = rect.x * scale.x;
      const sy = rect.y * scale.y;
      const sw = rect.w * scale.x;
      const sh = rect.h * scale.y;

      // Apply solid redaction
      ctx.save();
      ctx.fillStyle = '#0f172a'; // solid slate-900
      ctx.fillRect(sx, sy, sw, sh);
      ctx.restore();
    }

    // Convert canvas back to File
    const blob = await new Promise(res => outCanvas.toBlob(res, file.type || 'image/jpeg', 0.92));
    const newFile = new File([blob], file.name, { type: file.type || 'image/jpeg', lastModified: Date.now() });
    onConfirm(newFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold">Redact Number Plate</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Draw a box over the number plate to hide it before publishing.</p>
          </div>
          <button onClick={onCancel} className="rounded-lg p-2 hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Canvas */}
        <div className="overflow-auto bg-muted/30 flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            className="rounded-xl cursor-crosshair touch-none max-w-full"
            style={{ border: '2px solid hsl(var(--border))' }}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border">
          <button
            type="button"
            onClick={handleClear}
            disabled={!rect}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 transition"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2 rounded-xl gradient-emerald text-primary-foreground text-sm font-semibold shadow-sm hover:opacity-90 transition"
            >
              <Check className="h-4 w-4" />
              {rect ? 'Apply & Done' : 'Done (No Plate)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
