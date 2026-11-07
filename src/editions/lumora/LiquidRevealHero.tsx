import { useEffect, useRef } from 'react';

interface Droplet {
  x: number;
  y: number;
  radius: number;
  life: number;
}

/**
 * LiquidRevealHero — Animation signature de Lumora :
 * Superpose au sous-pixel près une version monochrome argentique d'architecture ("Before")
 * et la photographie solaire dorée haute définition ("After").
 * Le sillage organique du curseur révèle la lumière chaude avec une physique fluide amortie.
 */
export function LiquidRevealHero({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      ctx = null;
    }
    if (!ctx) return;

    let rafId = 0;
    let disposed = false;
    const droplets: Droplet[] = [];
    const pointer = { x: 0.55, y: 0.48, targetX: 0.55, targetY: 0.48, active: false };

    // Canvas hors-écran contenant la version monochrome argentique haute précision
    const monoCanvas = document.createElement('canvas');
    const maskCanvas = document.createElement('canvas');
    const colorLayerCanvas = document.createElement('canvas');

    const img = new Image();
    img.decoding = 'async';
    img.src = '/lumora/hero-studio.jpg';

    let imageLoaded = false;

    const rebuildOffscreenBuffers = () => {
      if (!imageLoaded || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) return;

      monoCanvas.width = w;
      monoCanvas.height = h;
      maskCanvas.width = w;
      maskCanvas.height = h;
      colorLayerCanvas.width = w;
      colorLayerCanvas.height = h;

      const imgAspect = img.width / Math.max(1, img.height);
      const viewAspect = w / h;
      let drawW = w;
      let drawH = h;
      let offsetX = 0;
      let offsetY = 0;

      if (viewAspect > imgAspect) {
        drawW = w;
        drawH = w / imgAspect;
        offsetY = (h - drawH) * 0.5;
      } else {
        drawH = h;
        drawW = h * imgAspect;
        offsetX = (w - drawW) * 0.5;
      }

      // Couche couleur dorée ("After")
      const cCtx = colorLayerCanvas.getContext('2d');
      if (cCtx) {
        cCtx.clearRect(0, 0, w, h);
        cCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
      }

      // Couche monochrome argentique contrastée ("Before")
      const mCtx = monoCanvas.getContext('2d');
      if (mCtx) {
        mCtx.clearRect(0, 0, w, h);
        mCtx.filter = 'grayscale(100%) contrast(114%) brightness(82%)';
        mCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
        mCtx.filter = 'none';
      }
    };

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        rebuildOffscreenBuffers();
      }
    };

    img.onload = () => {
      if (disposed) return;
      imageLoaded = true;
      syncSize();
    };

    const pushDroplet = (normX: number, normY: number, baseRadius: number) => {
      droplets.push({
        x: normX,
        y: normY,
        radius: baseRadius,
        life: 1.0,
      });
      if (droplets.length > 28) {
        droplets.shift();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.targetX = (e.clientX - rect.left) / rect.width;
      pointer.targetY = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
      if (!reducedMotion) {
        pushDroplet(pointer.targetX, pointer.targetY, 0.16);
      }
    };

    const parent = canvas.parentElement;
    parent?.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', syncSize, { passive: true });
    syncSize();

    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (imageLoaded && canvas.width > 0 && canvas.height > 0) {
        const w = canvas.width;
        const h = canvas.height;
        const minDim = Math.min(w, h);

        // Si mouvement réduit : affiche directement la photographie dorée nette
        if (reducedMotion) {
          ctx.drawImage(colorLayerCanvas, 0, 0);
          return;
        }

        // Goutte lumineuse autonome douce lorsque le curseur est immobile
        const t = now * 0.00065;
        const idleX = 0.56 + Math.cos(t) * 0.22;
        const idleY = 0.48 + Math.sin(t * 1.3) * 0.15;
        if (!pointer.active) {
          pointer.targetX = idleX;
          pointer.targetY = idleY;
        }

        pointer.x += (pointer.targetX - pointer.x) * Math.min(1, dt * 8.5);
        pointer.y += (pointer.targetY - pointer.y) * Math.min(1, dt * 8.5);

        // 1. Dessine la base monochrome argentique
        ctx.drawImage(monoCanvas, 0, 0);

        // 2. Construit le masque liquide organique dans maskCanvas
        const maskCtx = maskCanvas.getContext('2d');
        if (maskCtx) {
          maskCtx.clearRect(0, 0, w, h);
          maskCtx.globalCompositeOperation = 'source-over';

          // Halo principal sous le curseur amorti
          const mainR = minDim * 0.27;
          const gx = pointer.x * w;
          const gy = pointer.y * h;
          const mainGrad = maskCtx.createRadialGradient(gx, gy, mainR * 0.18, gx, gy, mainR);
          mainGrad.addColorStop(0, 'rgba(255,255,255,1)');
          mainGrad.addColorStop(0.62, 'rgba(255,255,255,0.82)');
          mainGrad.addColorStop(1, 'rgba(255,255,255,0)');
          maskCtx.fillStyle = mainGrad;
          maskCtx.beginPath();
          maskCtx.arc(gx, gy, mainR, 0, Math.PI * 2);
          maskCtx.fill();

          // Sillage fluide des gouttes récentes
          for (let i = droplets.length - 1; i >= 0; i--) {
            const d = droplets[i];
            d.life -= dt * 0.72;
            if (d.life <= 0) {
              droplets.splice(i, 1);
              continue;
            }
            const r = minDim * d.radius * (0.65 + 0.35 * d.life);
            const dx = d.x * w;
            const dy = d.y * h;
            const dg = maskCtx.createRadialGradient(dx, dy, r * 0.12, dx, dy, r);
            dg.addColorStop(0, `rgba(255,255,255,${(d.life * 0.92).toFixed(3)})`);
            dg.addColorStop(1, 'rgba(255,255,255,0)');
            maskCtx.fillStyle = dg;
            maskCtx.beginPath();
            maskCtx.arc(dx, dy, r, 0, Math.PI * 2);
            maskCtx.fill();
          }

          // Découpe la photographie solaire par le masque liquide
          maskCtx.globalCompositeOperation = 'source-in';
          maskCtx.drawImage(colorLayerCanvas, 0, 0);
          maskCtx.globalCompositeOperation = 'source-over';

          // 3. Superpose la révélation liquide sur la base monochrome
          ctx.drawImage(maskCanvas, 0, 0);
        }
      }

      rafId = window.requestAnimationFrame(renderLoop);
    };

    rafId = window.requestAnimationFrame(renderLoop);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      parent?.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', syncSize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="lum-hero__canvas"
      aria-hidden="true"
    />
  );
}
