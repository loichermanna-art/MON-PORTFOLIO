import * as THREE from 'three';
import type { ProjectCaseStudy } from '../../data/portfolioData';

function createFallbackTexture(): THREE.DataTexture {
  const data = new Uint8Array([16, 39, 71, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
}

/**
 * Engraved Midnight-Blue & Brushed-Brass Architectural Room Lintel Plaque
 */
export function createRoomLintelTexture(
  code: string,
  title: string,
  subtitle: string,
  anisotropy = 4
): THREE.Texture {
  if (typeof document === 'undefined') return createFallbackTexture();
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 220;
  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  // Deep Midnight Blue architectural plate (#071426 -> #102747)
  const bg = ctx.createLinearGradient(0, 0, 1024, 220);
  bg.addColorStop(0, '#071426');
  bg.addColorStop(0.5, '#102747');
  bg.addColorStop(1, '#071426');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 220);

  // Fine brushed brass double border
  ctx.strokeStyle = '#c8a66b';
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, 996, 192);
  ctx.strokeStyle = 'rgba(118, 169, 232, 0.42)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(24, 24, 976, 172);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#76A9E8';
  ctx.font = '600 22px "Geist Mono", ui-monospace, monospace';
  ctx.fillText(`ESPACE ${code}  ·  PARCOURS ARCHITECTURAL`, 512, 62);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 54px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(title.toUpperCase(), 512, 128);

  ctx.fillStyle = '#E8EDF5';
  ctx.font = '400 23px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(subtitle, 512, 172);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Museum Station Plaque mounted on 3D Lecterns, Steles & Pillars
 */
export function createStationPlaqueTexture(opts: {
  code: string;
  badge: string;
  title: string;
  subtitle: string;
  summary?: string;
  ctaLabel?: string;
  anisotropy?: number;
}): THREE.Texture {
  if (typeof document === 'undefined') return createFallbackTexture();
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const bg = ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#091a32');
  bg.addColorStop(1, '#071426');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 768, 512);

  // Brass architectural frame
  ctx.strokeStyle = '#c4a267';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 732, 476);

  // Top index row
  ctx.fillStyle = '#76A9E8';
  ctx.font = '600 22px "Geist Mono", ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(opts.code, 48, 70);

  ctx.fillStyle = '#c8a66b';
  ctx.font = '600 19px "Geist Mono", ui-monospace, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(opts.badge.slice(0, 32), 720, 70);

  // Rule line
  ctx.fillStyle = 'rgba(118, 169, 232, 0.32)';
  ctx.fillRect(48, 92, 672, 2);

  // Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 42px "Cormorant Garamond", Georgia, serif';
  const titleLines = wrapText(ctx, opts.title, 672, 2);
  let y = 148;
  for (const line of titleLines) {
    ctx.fillText(line, 48, y);
    y += 48;
  }

  // Subtitle
  ctx.fillStyle = '#76A9E8';
  ctx.font = '500 22px "Plus Jakarta Sans", system-ui, sans-serif';
  const subLines = wrapText(ctx, opts.subtitle, 672, 2);
  y += 10;
  for (const line of subLines) {
    ctx.fillText(line, 48, y);
    y += 30;
  }

  // Summary excerpt
  if (opts.summary) {
    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 21px "Plus Jakarta Sans", system-ui, sans-serif';
    const sumLines = wrapText(ctx, opts.summary, 672, 4);
    y += 16;
    for (const line of sumLines) {
      if (y > 418) break;
      ctx.fillText(line, 48, y);
      y += 30;
    }
  }

  // Footer CTA prompt
  ctx.fillStyle = '#102747';
  ctx.fillRect(48, 430, 672, 44);
  ctx.strokeStyle = 'rgba(118, 169, 232, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 430, 672, 44);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 19px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(opts.ctaLabel ?? 'Cliquer pour s’approcher & inspecter →', 68, 459);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = opts.anisotropy ?? 4;
  tex.needsUpdate = true;
  return tex;
}

/**
 * High-definition 1536×960 Backlit 3D Project Exhibition Screen Texture.
 * Immediately renders a museum-grade presentation board and progressively
 * composites the real project visual when CORS image loading succeeds.
 */
export function createProjectExhibitionScreenTexture(
  project: ProjectCaseStudy,
  visualIndex: number,
  anisotropy = 8
): THREE.Texture {
  if (typeof document === 'undefined') return createFallbackTexture();
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 960;
  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;

  const visual = project.visuals[visualIndex % project.visuals.length] ?? project.visuals[0];

  const drawFrame = (loadedImg?: HTMLImageElement) => {
    // Deep architectural museum backdrop
    const grad = ctx.createLinearGradient(0, 0, 1536, 960);
    grad.addColorStop(0, '#071426');
    grad.addColorStop(0.55, '#0d2240');
    grad.addColorStop(1, '#071426');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1536, 960);

    // Outer brass & sky bezel
    ctx.strokeStyle = '#c8a66b';
    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, 1496, 920);

    // Top browser/exhibition bar
    ctx.fillStyle = '#102747';
    ctx.fillRect(44, 44, 1448, 76);
    ctx.fillStyle = '#76A9E8';
    ctx.font = '600 24px "Geist Mono", ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`RÉALISATION ${project.index}  ·  ${project.name}`, 74, 91);

    ctx.fillStyle = '#E8EDF5';
    ctx.textAlign = 'right';
    ctx.font = '500 22px "Geist Mono", ui-monospace, monospace';
    ctx.fillText(`EN LIGNE : ${project.liveUrlLabel}`, 1462, 91);

    // Left column: Visual Viewport (860 x 740)
    const vx = 44;
    const vy = 144;
    const vw = 856;
    const vh = 752;

    ctx.fillStyle = '#050e1c';
    ctx.fillRect(vx, vy, vw, vh);
    ctx.strokeStyle = 'rgba(118, 169, 232, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(vx, vy, vw, vh);

    if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
      // Letterbox/cover fit preserving aspect ratio
      const pad = 18;
      const availW = vw - pad * 2;
      const availH = vh - 86;
      const scale = Math.min(
        availW / loadedImg.naturalWidth,
        availH / loadedImg.naturalHeight
      );
      const dw = loadedImg.naturalWidth * scale;
      const dh = loadedImg.naturalHeight * scale;
      const dx = vx + (vw - dw) * 0.5;
      const dy = vy + 18 + (availH - dh) * 0.5;
      ctx.drawImage(loadedImg, dx, dy, dw, dh);
    } else {
      // Crisp architectural technical plate while image loads or if external host omits CORS
      ctx.fillStyle = '#0b1e38';
      ctx.fillRect(vx + 24, vy + 24, vw - 48, vh - 110);
      ctx.strokeStyle = 'rgba(200, 166, 107, 0.45)';
      ctx.strokeRect(vx + 44, vy + 44, vw - 88, vh - 150);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#76A9E8';
      ctx.font = '600 24px "Geist Mono", ui-monospace, monospace';
      ctx.fillText(project.pavilionCode, vx + vw * 0.5, vy + 170);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 76px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(project.name, vx + vw * 0.5, vy + 280);

      ctx.fillStyle = '#E8EDF5';
      ctx.font = '400 26px "Plus Jakarta Sans", system-ui, sans-serif';
      const pitchLines = wrapText(ctx, project.oneLinePitch, vw - 150, 4);
      let py = vy + 360;
      for (const l of pitchLines) {
        ctx.fillText(l, vx + vw * 0.5, py);
        py += 38;
      }

      ctx.fillStyle = '#c8a66b';
      ctx.font = '600 22px "Geist Mono", ui-monospace, monospace';
      ctx.fillText(`↗ ${project.liveUrl}`, vx + vw * 0.5, vy + 575);
    }

    // Caption strip inside visual viewport
    ctx.fillStyle = 'rgba(7, 20, 38, 0.94)';
    ctx.fillRect(vx + 2, vy + vh - 64, vw - 4, 62);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 19px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      (visual?.caption ?? project.category).slice(0, 78),
      vx + 22,
      vy + vh - 26
    );

    // Right column: Verified Case Study Highlights (568 px wide)
    const rx = 928;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#c8a66b';
    ctx.font = '600 20px "Geist Mono", ui-monospace, monospace';
    ctx.fillText('ÉTUDE DE CAS VÉRIFIÉE', rx, 182);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 44px "Cormorant Garamond", Georgia, serif';
    const catLines = wrapText(ctx, project.category, 550, 2);
    let ry = 232;
    for (const line of catLines) {
      ctx.fillText(line, rx, ry);
      ry += 48;
    }

    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 22px "Plus Jakarta Sans", system-ui, sans-serif';
    const solLines = wrapText(ctx, project.oneLinePitch, 550, 4);
    ry += 12;
    for (const line of solLines) {
      ctx.fillText(line, rx, ry);
      ry += 32;
    }

    // Key verified features
    ry += 22;
    ctx.fillStyle = '#76A9E8';
    ctx.font = '600 19px "Geist Mono", ui-monospace, monospace';
    ctx.fillText('FONCTIONNALITÉS CLÉS', rx, ry);
    ry += 32;

    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 20px "Plus Jakarta Sans", system-ui, sans-serif';
    for (const feat of project.verifiedFeatures.slice(0, 3)) {
      const fLines = wrapText(ctx, `• ${feat}`, 548, 2);
      for (const fl of fLines) {
        if (ry > 760) break;
        ctx.fillText(fl, rx, ry);
        ry += 28;
      }
      ry += 8;
    }

    // Tech stack pills at bottom right
    ctx.fillStyle = '#174477';
    ctx.fillRect(rx, 822, 564, 74);
    ctx.strokeStyle = '#76A9E8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx, 822, 564, 74);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 22px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Cliquer sur l’écran pour inspecter le projet →', rx + 24, 867);

    tex.needsUpdate = true;
  };

  drawFrame();

  if (typeof Image !== 'undefined' && visual?.src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawFrame(img);
    };
    img.onerror = () => {
      // Keep crisp procedural presentation board if cross-origin host omits CORS
    };
    img.src = visual.src;
  }

  return tex;
}
