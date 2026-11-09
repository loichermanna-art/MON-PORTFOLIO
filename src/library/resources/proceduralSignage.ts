import * as THREE from 'three';
import type { ProjectCaseStudy } from '../../data/portfolioData';

/**
 * Monochrome Carbon, Titanium & Pure White Architectural Signage System (2K / HD Mipmapped)
 * Zero blue, zero visual clutter — gallery-grade Apple / Foster + Partners aesthetic.
 */

function finalizeArchitecturalTexture(
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

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = w;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
}

/**
 * 1. Minimalist Carbon & Titanium Architrave Lintel (1536 × 256)
 */
export function createRoomLintelTexture(
  code: string,
  title: string,
  _subtitle: string,
  anisotropy = 16
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#0f1013';
  ctx.fillRect(0, 0, 1536, 256);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 1496, 216);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 56px "Plus Jakarta Sans Variable", system-ui, sans-serif';
  ctx.fillText(`${code}   ·   ${title.toUpperCase()}`, 768, 128);

  return finalizeArchitecturalTexture(canvas, anisotropy);
}

/**
 * 2. Minimalist Carbon & Brushed Titanium Circular Floor Medallion (512 × 512)
 */
export function createFloorMedallionTexture(
  topLabel: string,
  centerCode: string,
  bottomLabel: string,
  isHighlighted = false,
  anisotropy = 16
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 512);

  ctx.fillStyle = isHighlighted ? '#1c1e23' : '#111215';
  ctx.beginPath();
  ctx.arc(256, 256, 244, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isHighlighted ? '#FFFFFF' : '#9ca1ab';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 234, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 256, 208, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#9ca1ab';
  ctx.font = '600 22px "Geist Mono Variable", monospace';
  ctx.fillText(topLabel.toUpperCase().slice(0, 14), 256, 152);

  ctx.fillStyle = '#FFFFFF';
  ctx.font =
    centerCode.length > 4
      ? '600 68px "Plus Jakarta Sans Variable", sans-serif'
      : '600 104px "Plus Jakarta Sans Variable", sans-serif';
  ctx.fillText(centerCode, 256, 282);

  ctx.fillStyle = '#d4d7de';
  ctx.font = '500 21px "Plus Jakarta Sans Variable", sans-serif';
  ctx.fillText(bottomLabel.slice(0, 20), 256, 364);

  return finalizeArchitecturalTexture(canvas, anisotropy);
}

/**
 * 3. Ultra-Clean Gallery Stele Tablet (1280 × 896)
 * Minimalist layout: Number, Clean Title, 1-line Subtitle, Progress Dots & 3 Titanium Pills.
 * Zero cluttered body paragraphs or noisy CTA banners.
 */
export function createStationPlaqueTexture(opts: {
  code: string;
  badge: string;
  title: string;
  subtitle: string;
  summary: string;
  tags?: string[];
  stepIndex?: number;
  stepTotal?: number;
  ctaLabel?: string;
  anisotropy?: number;
}): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 896;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pure matte carbon-slate surface
  ctx.fillStyle = '#111215';
  ctx.fillRect(0, 0, 1280, 896);

  // Hairline architectural border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 36, 1208, 824);

  // Top index + quiet category label
  ctx.textAlign = 'left';
  ctx.fillStyle = '#9ca1ab';
  ctx.font = '500 26px "Geist Mono Variable", monospace';
  ctx.fillText(opts.badge.toUpperCase(), 88, 124);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 34px "Geist Mono Variable", monospace';
  ctx.fillText(opts.code, 1192, 124);

  // Minimal progress ticks when part of a sequence (e.g. Parcours 1..6)
  if (
    typeof opts.stepIndex === 'number' &&
    typeof opts.stepTotal === 'number' &&
    opts.stepTotal > 1
  ) {
    const totalW = 1104;
    const gap = 12;
    const segW = (totalW - gap * (opts.stepTotal - 1)) / opts.stepTotal;
    for (let i = 0; i < opts.stepTotal; i++) {
      ctx.fillStyle =
        i === opts.stepIndex
          ? '#FFFFFF'
          : i < opts.stepIndex
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(88 + i * (segW + gap), 162, segW, 4);
    }
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.fillRect(88, 162, 1104, 2);
  }

  // Large Pure White Architectural Title (max 2 lines, generous breathing room)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 62px "Plus Jakarta Sans Variable", system-ui, sans-serif';
  const titleLines = wrapLines(ctx, opts.title, 1104, 2);
  let y = 290;
  for (const line of titleLines) {
    ctx.fillText(line, 88, y);
    y += 76;
  }

  // Clean Titanium Subtitle (max 2 lines)
  ctx.fillStyle = '#b4b9c2';
  ctx.font = '400 34px "Plus Jakarta Sans Variable", system-ui, sans-serif';
  const subLines = wrapLines(ctx, opts.subtitle, 1104, 2);
  y += 18;
  for (const sLine of subLines) {
    ctx.fillText(sLine, 88, y);
    y += 46;
  }

  // Up to 3 clean minimal Titanium pills at bottom-left
  if (opts.tags && opts.tags.length > 0) {
    let tx = 88;
    const ty = 742;
    ctx.font = '500 24px "Geist Mono Variable", monospace';
    for (const tag of opts.tags.slice(0, 3)) {
      const label = tag.length > 26 ? `${tag.slice(0, 24)}…` : tag;
      const tw = ctx.measureText(label).width + 44;
      if (tx + tw > 1192) break;
      ctx.fillStyle = '#1b1d22';
      ctx.fillRect(tx, ty, tw, 52);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx, ty, tw, 52);
      ctx.fillStyle = '#e6e8ec';
      ctx.fillText(label, tx + 22, ty + 34);
      tx += tw + 16;
    }
  }

  return finalizeArchitecturalTexture(canvas, opts.anisotropy ?? 16);
}

/**
 * 4. True 2K (2048 × 1280) Monochrome Carbon & Titanium Studio Display for Projects
 */
export function createProjectExhibitionScreenTexture(
  project: ProjectCaseStudy,
  visualIndex = 0,
  anisotropy = 16
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');
  const tex = finalizeArchitecturalTexture(canvas, anisotropy);
  if (!ctx) return tex;

  const activeVisual =
    project.visuals[visualIndex % project.visuals.length] ?? project.visuals[0];

  const drawFrame = (loadedImg?: HTMLImageElement) => {
    // Pure Carbon Black Studio Display frame
    ctx.fillStyle = '#0c0d0f';
    ctx.fillRect(0, 0, 2048, 1280);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(28, 28, 1992, 1224);

    // Minimalist Header Bar
    ctx.textAlign = 'left';
    ctx.fillStyle = '#9ca1ab';
    ctx.font = '500 26px "Geist Mono Variable", monospace';
    ctx.fillText(
      `${project.index}  ·  ${project.category.toUpperCase()}`,
      72,
      92
    );

    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 34px "Plus Jakarta Sans Variable", sans-serif';
    ctx.fillText(project.name.toUpperCase(), 1976, 92);

    // Massive 2K Visual Showcase Viewport (x=64, y=126, w=1920, h=1040)
    const vx = 64;
    const vy = 126;
    const vw = 1920;
    const vh = 1040;

    ctx.fillStyle = '#14161a';
    ctx.fillRect(vx, vy, vw, vh);

    if (loadedImg && loadedImg.naturalWidth > 0) {
      const imgRatio = loadedImg.naturalWidth / loadedImg.naturalHeight;
      const boxRatio = vw / vh;
      let dw = vw;
      let dh = vh;
      let dx = vx;
      let dy = vy;
      if (imgRatio > boxRatio) {
        dh = vw / imgRatio;
        dy = vy + (vh - dh) * 0.5;
      } else {
        dw = vh * imgRatio;
        dx = vx + (vw - dw) * 0.5;
      }
      ctx.drawImage(loadedImg, dx, dy, dw, dh);
    } else {
      // Clean Monochrome Studio Presentation Board while external screenshot loads
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.font = '600 92px "Plus Jakarta Sans Variable", sans-serif';
      ctx.fillText(project.name, vx + 96, vy + 240);

      ctx.fillStyle = '#b4b9c2';
      ctx.font = '400 38px "Plus Jakarta Sans Variable", sans-serif';
      const pitchLines = wrapLines(ctx, project.oneLinePitch, vw - 192, 3);
      let py = vy + 340;
      for (const pl of pitchLines) {
        ctx.fillText(pl, vx + 96, py);
        py += 54;
      }

      // 3 minimal technology pills
      let tx = vx + 96;
      ctx.font = '500 26px "Geist Mono Variable", monospace';
      for (const tech of project.technologies.slice(0, 4)) {
        const tw = ctx.measureText(tech.label).width + 48;
        ctx.fillStyle = '#1f2228';
        ctx.fillRect(tx, vy + 860, tw, 58);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
        ctx.strokeRect(tx, vy + 860, tw, 58);
        ctx.fillStyle = '#f5f5f7';
        ctx.fillText(tech.label, tx + 24, vy + 898);
        tx += tw + 18;
      }
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 2;
    ctx.strokeRect(vx, vy, vw, vh);

    // Whisper-clean footer domain only
    ctx.textAlign = 'left';
    ctx.fillStyle = '#8e939e';
    ctx.font = '400 23px "Geist Mono Variable", monospace';
    ctx.fillText(
      project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      72,
      1216
    );

    ctx.textAlign = 'right';
    ctx.fillStyle = '#d4d7de';
    ctx.fillText(
      `${(visualIndex % project.visuals.length) + 1} / ${project.visuals.length}`,
      1976,
      1216
    );

    tex.needsUpdate = true;
  };

  drawFrame();

  if (typeof Image !== 'undefined' && activeVisual?.src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        drawFrame(img);
      } catch {
        drawFrame();
      }
    };
    img.onerror = () => {
      drawFrame();
    };
    img.src = activeVisual.src;
  }

  return tex;
}
