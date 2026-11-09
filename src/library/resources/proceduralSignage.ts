import * as THREE from 'three';
import type { ProjectCaseStudy } from '../../data/portfolioData';

function createFallbackTexture(): THREE.DataTexture {
  const data = new Uint8Array([16, 39, 71, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function finalizeHighResTexture(
  canvas: HTMLCanvasElement,
  anisotropy = 16
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

function drawCornerOrnaments(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  size: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - size, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + size);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - size);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + size, y + h);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - size, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - size);
  ctx.stroke();
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
 * 1536×320 Engraved Sanctuary Architrave Lintel Plaque
 */
export function createRoomLintelTexture(
  code: string,
  title: string,
  subtitle: string,
  anisotropy = 16
): THREE.Texture {
  if (typeof document === 'undefined') return createFallbackTexture();
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const bg = ctx.createLinearGradient(0, 0, 1536, 320);
  bg.addColorStop(0, '#051020');
  bg.addColorStop(0.5, '#0e2444');
  bg.addColorStop(1, '#051020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1536, 320);

  ctx.strokeStyle = '#d4b277';
  ctx.lineWidth = 5;
  ctx.strokeRect(18, 18, 1500, 284);
  drawCornerOrnaments(ctx, 32, 32, 1472, 256, 34, '#76A9E8');

  ctx.textAlign = 'center';
  ctx.fillStyle = '#d4b277';
  ctx.font = '600 28px "Geist Mono", ui-monospace, monospace';
  ctx.fillText(`SANCTUAIRE ${code}  ·  TEMPLE DE LOÏC AKANDA`, 768, 86);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 82px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(title.toUpperCase(), 768, 186);

  ctx.fillStyle = '#E8EDF5';
  ctx.font = '400 31px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(subtitle, 768, 252);

  return finalizeHighResTexture(canvas, anisotropy);
}

/**
 * 512×512 Engraved Circular Floor Medallion Texture (Room Numbers & Timeline Dates)
 */
export function createFloorMedallionTexture(
  topLabel: string,
  mainCode: string,
  bottomLabel: string,
  isHighlighted = false,
  anisotropy = 8
): THREE.Texture {
  if (typeof document === 'undefined') return createFallbackTexture();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const cx = 256;
  const cy = 256;

  const rad = ctx.createRadialGradient(cx, cy, 24, cx, cy, 252);
  rad.addColorStop(0, isHighlighted ? '#174477' : '#0d2240');
  rad.addColorStop(1, '#061224');
  ctx.fillStyle = rad;
  ctx.beginPath();
  ctx.arc(cx, cy, 252, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#d4b277';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 236, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(118, 169, 232, 0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 212, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#76A9E8';
  ctx.font = '600 26px "Geist Mono", ui-monospace, monospace';
  ctx.fillText(topLabel, cx, 152);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 108px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(mainCode, cx, 286);

  ctx.fillStyle = '#d4b277';
  ctx.font = '600 25px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(bottomLabel.slice(0, 22), cx, 368);

  return finalizeHighResTexture(canvas, anisotropy);
}

/**
 * 1280×896 High-Definition Engraved Temple Tablet mounted on Steles, Altars & Pillars
 */
export function createStationPlaqueTexture(opts: {
  code: string;
  badge: string;
  title: string;
  subtitle: string;
  summary?: string;
  tags?: string[];
  stepIndex?: number;
  stepTotal?: number;
  ctaLabel?: string;
  anisotropy?: number;
}): THREE.Texture {
  if (typeof document === 'undefined') return createFallbackTexture();
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 896;
  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  // Rich Midnight Obsidian-Sapphire stone tablet background
  const bg = ctx.createLinearGradient(0, 0, 0, 896);
  bg.addColorStop(0, '#0a1d38');
  bg.addColorStop(0.55, '#071528');
  bg.addColorStop(1, '#040d1b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1280, 896);

  // Outer brushed gold bevel & inner sky-blue hairline
  ctx.strokeStyle = '#d4b277';
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, 1232, 848);
  drawCornerOrnaments(ctx, 42, 42, 1196, 812, 36, '#76A9E8');

  // Header band
  ctx.fillStyle = 'rgba(16, 39, 71, 0.78)';
  ctx.fillRect(64, 62, 1152, 68);

  ctx.fillStyle = '#76A9E8';
  ctx.font = '600 30px "Geist Mono", ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(opts.code, 92, 106);

  ctx.fillStyle = '#d4b277';
  ctx.font = '600 26px "Geist Mono", ui-monospace, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(opts.badge.slice(0, 36), 1188, 106);

  // Optional chronological stepper bar (for Room 02 Le Parcours & Room 05 La Méthode)
  let y = 206;
  if (opts.stepTotal && opts.stepIndex !== undefined) {
    const barX = 72;
    const barY = 152;
    const segW = (1136 - (opts.stepTotal - 1) * 12) / opts.stepTotal;
    for (let i = 0; i < opts.stepTotal; i++) {
      ctx.fillStyle =
        i <= opts.stepIndex
          ? i === opts.stepIndex
            ? '#d4b277'
            : '#76A9E8'
          : 'rgba(118, 169, 232, 0.2)';
      ctx.fillRect(barX + i * (segW + 12), barY, segW, 8);
    }
    y = 228;
  }

  // Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 64px "Cormorant Garamond", Georgia, serif';
  const titleLines = wrapText(ctx, opts.title, 1136, 2);
  for (const line of titleLines) {
    ctx.fillText(line, 72, y);
    y += 70;
  }

  // Subtitle
  ctx.fillStyle = '#76A9E8';
  ctx.font = '600 32px "Plus Jakarta Sans", system-ui, sans-serif';
  const subLines = wrapText(ctx, opts.subtitle, 1136, 2);
  y += 10;
  for (const line of subLines) {
    ctx.fillText(line, 72, y);
    y += 44;
  }

  // Gold divider
  y += 12;
  ctx.fillStyle = 'rgba(212, 178, 119, 0.45)';
  ctx.fillRect(72, y, 220, 3);
  y += 44;

  // Summary excerpt
  if (opts.summary) {
    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 31px "Plus Jakarta Sans", system-ui, sans-serif';
    const sumLines = wrapText(ctx, opts.summary, 1136, 4);
    for (const line of sumLines) {
      if (y > 670) break;
      ctx.fillText(line, 72, y);
      y += 44;
    }
  }

  // Tag pills row
  if (opts.tags && opts.tags.length > 0) {
    let tx = 72;
    const ty = 696;
    ctx.font = '600 23px "Geist Mono", ui-monospace, monospace';
    for (const tag of opts.tags.slice(0, 3)) {
      const label = tag.slice(0, 28);
      const tw = ctx.measureText(label).width + 36;
      if (tx + tw > 1208) break;
      ctx.fillStyle = '#102747';
      ctx.fillRect(tx, ty, tw, 44);
      ctx.strokeStyle = 'rgba(118, 169, 232, 0.48)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx, ty, tw, 44);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, tx + 18, ty + 30);
      tx += tw + 14;
    }
  }

  // Footer Interactive Callout
  ctx.fillStyle = '#174477';
  ctx.fillRect(72, 766, 1136, 68);
  ctx.strokeStyle = '#d4b277';
  ctx.lineWidth = 2;
  ctx.strokeRect(72, 766, 1136, 68);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 28px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(
    opts.ctaLabel ?? 'Cliquer sur la stèle pour s’approcher & lire le dossier →',
    104,
    810
  );

  return finalizeHighResTexture(canvas, opts.anisotropy ?? 16);
}

/**
 * TRUE 2K (2048×1280) Backlit 3D Project Sanctuary Screen Texture
 */
export function createProjectExhibitionScreenTexture(
  project: ProjectCaseStudy,
  visualIndex: number,
  anisotropy = 16
): THREE.Texture {
  if (typeof document === 'undefined') return createFallbackTexture();
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const tex = finalizeHighResTexture(canvas, anisotropy);
  const totalVisuals = project.visuals.length;
  const normIdx = ((visualIndex % totalVisuals) + totalVisuals) % totalVisuals;
  const visual = project.visuals[normIdx] ?? project.visuals[0];

  const drawFrame = (loadedImg?: HTMLImageElement) => {
    const grad = ctx.createLinearGradient(0, 0, 2048, 1280);
    grad.addColorStop(0, '#051020');
    grad.addColorStop(0.5, '#0c213f');
    grad.addColorStop(1, '#051020');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 1280);

    // Sculpted double brass & sky border
    ctx.strokeStyle = '#d4b277';
    ctx.lineWidth = 7;
    ctx.strokeRect(24, 24, 2000, 1232);
    drawCornerOrnaments(ctx, 42, 42, 1964, 1196, 42, '#76A9E8');

    // Top Sanctuary Header Bar
    ctx.fillStyle = '#102747';
    ctx.fillRect(58, 58, 1932, 98);
    ctx.fillStyle = '#d4b277';
    ctx.font = '600 31px "Geist Mono", ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `SANCTUAIRE PROJET ${project.index}  ·  ${project.name}`,
      94,
      118
    );

    ctx.fillStyle = '#76A9E8';
    ctx.textAlign = 'right';
    ctx.font = '600 28px "Geist Mono", ui-monospace, monospace';
    ctx.fillText(
      `VUE ${normIdx + 1}/${totalVisuals}  ·  ${project.liveUrlLabel}`,
      1954,
      118
    );

    // Left Viewport: High-Def Visual Frame (1160 x 1010)
    const vx = 58;
    const vy = 184;
    const vw = 1160;
    const vh = 1016;

    ctx.fillStyle = '#040b16';
    ctx.fillRect(vx, vy, vw, vh);
    ctx.strokeStyle = 'rgba(118, 169, 232, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(vx, vy, vw, vh);

    if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
      const pad = 22;
      const availW = vw - pad * 2;
      const availH = vh - 108;
      const scale = Math.min(
        availW / loadedImg.naturalWidth,
        availH / loadedImg.naturalHeight
      );
      const dw = loadedImg.naturalWidth * scale;
      const dh = loadedImg.naturalHeight * scale;
      const dx = vx + (vw - dw) * 0.5;
      const dy = vy + 20 + (availH - dh) * 0.5;
      ctx.drawImage(loadedImg, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = '#0a1c36';
      ctx.fillRect(vx + 28, vy + 28, vw - 56, vh - 132);
      ctx.strokeStyle = 'rgba(212, 178, 119, 0.55)';
      ctx.lineWidth = 2;
      ctx.strokeRect(vx + 52, vy + 52, vw - 104, vh - 180);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#76A9E8';
      ctx.font = '600 30px "Geist Mono", ui-monospace, monospace';
      ctx.fillText(project.pavilionCode, vx + vw * 0.5, vy + 220);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 104px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(project.name, vx + vw * 0.5, vy + 370);

      ctx.fillStyle = '#E8EDF5';
      ctx.font = '400 34px "Plus Jakarta Sans", system-ui, sans-serif';
      const pitchLines = wrapText(ctx, project.oneLinePitch, vw - 180, 4);
      let py = vy + 475;
      for (const l of pitchLines) {
        ctx.fillText(l, vx + vw * 0.5, py);
        py += 48;
      }

      ctx.fillStyle = '#d4b277';
      ctx.font = '600 29px "Geist Mono", ui-monospace, monospace';
      ctx.fillText(`↗ ${project.liveUrl}`, vx + vw * 0.5, vy + 780);
    }

    // Bottom caption bar inside visual viewport
    ctx.fillStyle = 'rgba(5, 16, 32, 0.95)';
    ctx.fillRect(vx + 2, vy + vh - 84, vw - 4, 82);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 25px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      (visual?.caption ?? project.category).slice(0, 84),
      vx + 28,
      vy + vh - 32
    );

    // Right Column: Case Study Architecture Summary (736 px wide)
    const rx = 1254;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#d4b277';
    ctx.font = '600 26px "Geist Mono", ui-monospace, monospace';
    ctx.fillText('ARCHITECTURE & VALEUR RÉELLE', rx, 232);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 56px "Cormorant Garamond", Georgia, serif';
    const catLines = wrapText(ctx, project.category, 726, 2);
    let ry = 298;
    for (const line of catLines) {
      ctx.fillText(line, rx, ry);
      ry += 62;
    }

    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 28px "Plus Jakarta Sans", system-ui, sans-serif';
    const solLines = wrapText(ctx, project.oneLinePitch, 726, 4);
    ry += 16;
    for (const line of solLines) {
      ctx.fillText(line, rx, ry);
      ry += 40;
    }

    ry += 28;
    ctx.fillStyle = '#76A9E8';
    ctx.font = '600 25px "Geist Mono", ui-monospace, monospace';
    ctx.fillText('FONCTIONNALITÉS VÉRIFIÉES', rx, ry);
    ry += 42;

    ctx.fillStyle = '#E8EDF5';
    ctx.font = '400 26px "Plus Jakarta Sans", system-ui, sans-serif';
    for (const feat of project.verifiedFeatures.slice(0, 3)) {
      const fLines = wrapText(ctx, `• ${feat}`, 722, 2);
      for (const fl of fLines) {
        if (ry > 1030) break;
        ctx.fillText(fl, rx, ry);
        ry += 36;
      }
      ry += 12;
    }

    // Bottom CTA button plate
    ctx.fillStyle = '#174477';
    ctx.fillRect(rx, 1102, 734, 98);
    ctx.strokeStyle = '#d4b277';
    ctx.lineWidth = 3;
    ctx.strokeRect(rx, 1102, 734, 98);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 29px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Cliquer pour approcher & inspecter →', rx + 34, 1162);

    tex.needsUpdate = true;
  };

  drawFrame();

  if (typeof Image !== 'undefined' && visual?.src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => drawFrame(img);
    img.onerror = () => {};
    img.src = visual.src;
  }

  return tex;
}
