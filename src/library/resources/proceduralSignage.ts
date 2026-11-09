import * as THREE from 'three';
import {
  PROFILE_IDENTITY,
  type ProjectCaseStudy,
} from '../../data/portfolioData';
import type { WorldStation3D } from '../data/worldStations';

function configureCrispSignTexture(
  canvas: HTMLCanvasElement,
  maxAnisotropy = 8
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = Math.min(16, Math.max(4, maxAnisotropy));
  tex.needsUpdate = true;
  return tex;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 4
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  const rad = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/**
 * Architectural portal lintel signage (Monochrome Carbon, Titanium & Pure White).
 */
export interface EngravedSignOptions {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  width?: number;
  height?: number;
  maxAnisotropy?: number;
}

export function createEngravedSignTexture({
  eyebrow,
  title,
  subtitle,
  width = 1024,
  height = 256,
  maxAnisotropy = 8,
}: EngravedSignOptions): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return configureCrispSignTexture(canvas, maxAnisotropy);

  ctx.fillStyle = '#0E1013';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (eyebrow) {
    ctx.fillStyle = '#A4AAB6';
    ctx.font = `600 ${Math.round(height * 0.11)}px "Geist Mono Variable", monospace`;
    ctx.fillText(eyebrow.toUpperCase(), width / 2, height * 0.25);
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${Math.round(height * 0.25)}px "Plus Jakarta Sans Variable", system-ui, sans-serif`;
  ctx.fillText(title, width / 2, eyebrow ? height * 0.54 : height * 0.46, width - 80);

  if (subtitle) {
    ctx.fillStyle = '#C8CCD4';
    ctx.font = `400 ${Math.round(height * 0.12)}px "Plus Jakarta Sans Variable", system-ui, sans-serif`;
    ctx.fillText(subtitle, width / 2, height * 0.8, width - 96);
  }

  return configureCrispSignTexture(canvas, maxAnisotropy);
}

export function createRoomLintelTexture(
  code: string,
  title: string,
  subtitle?: string,
  maxAnisotropy = 16
): THREE.CanvasTexture {
  return createEngravedSignTexture({
    eyebrow: `ESPACE ${code}`,
    title,
    subtitle,
    width: 1536,
    height: 320,
    maxAnisotropy,
  });
}

/**
 * Circular Monochrome Titanium Floor Medallion (`01` .. `06` or Timeline nodes).
 */
export function createFloorMedallionTexture(
  topTag: string,
  centerCode: string,
  bottomLabel = '',
  emphasized = false,
  maxAnisotropy = 8
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return configureCrispSignTexture(canvas, maxAnisotropy);
  const c = size / 2;

  ctx.fillStyle = '#0D0E10';
  ctx.beginPath();
  ctx.arc(c, c, c - 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = emphasized ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)';
  ctx.lineWidth = emphasized ? 5 : 3.5;
  ctx.beginPath();
  ctx.arc(c, c, c - 16, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(200, 204, 212, 0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(c, c, c - 36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#9CA1AB';
  ctx.font = '600 22px "Geist Mono Variable", monospace';
  ctx.fillText(topTag.toUpperCase(), c, c - 112, size - 140);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${centerCode.length > 3 ? 78 : 118}px "Plus Jakarta Sans Variable", system-ui, sans-serif`;
  ctx.fillText(centerCode, c, c - 8, size - 110);

  if (bottomLabel) {
    ctx.fillStyle = '#C8CCD4';
    ctx.font = '600 23px "Geist Mono Variable", monospace';
    ctx.fillText(bottomLabel.toUpperCase(), c, c + 96, size - 110);
  }

  return configureCrispSignTexture(canvas, maxAnisotropy);
}

/* ============================================================================
   BESPOKE PROCEDURAL ARTWORKS & MULTI-SLIDE SWISS EXHIBITION TABLEAUX
   ============================================================================ */

function drawSwissHeaderAndFooter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  code: string,
  badge: string,
  slideIndex: number,
  slideLabels: [string, string, string]
) {
  const pad = Math.round(w * 0.062);

  // Matte Carbon Gallery Canvas
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#14161A');
  grad.addColorStop(0.5, '#0E1013');
  grad.addColorStop(1, '#0A0B0D');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle architectural frame & corner registration ticks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  // Top Header Bar
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 26px "Geist Mono Variable", monospace';
  ctx.fillText(code.toUpperCase(), pad, 86);

  ctx.fillStyle = '#8E94A0';
  ctx.font = '500 22px "Geist Mono Variable", monospace';
  const codeW = ctx.measureText(code.toUpperCase()).width;
  ctx.fillText(`  /  ${badge.toUpperCase()}`, pad + codeW + 8, 86);

  // Top-Right 3-Slide Interactive Pills (01 · 02 · 03)
  let pillRight = w - pad;
  for (let i = 2; i >= 0; i--) {
    const active = i === slideIndex;
    const txt = `0${i + 1} ${slideLabels[i]}`;
    ctx.font = `${active ? '700' : '500'} 20px "Geist Mono Variable", monospace`;
    const tw = ctx.measureText(txt).width;
    const pw = tw + 34;
    const ph = 42;
    const px = pillRight - pw;
    const py = 65;

    drawRoundedRect(ctx, px, py, pw, ph, 21);
    if (active) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.fillStyle = '#0D0E10';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#A6ACB8';
    }
    ctx.textAlign = 'center';
    ctx.fillText(txt, px + pw / 2, py + ph / 2 + 1);
    pillRight = px - 12;
  }

  // Hairline rule below header
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(pad, 132, w - pad * 2, 1.5);

  // Hairline rule above footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(pad, h - 96, w - pad * 2, 1.5);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#8E94A0';
  ctx.font = '500 20px "Geist Mono Variable", monospace';
  ctx.fillText('LOÏC AKANDA · EXPOSITION SPATIALE', pad, h - 56);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#D0D4DC';
  ctx.fillText(`VUE 0${slideIndex + 1} / 03`, w - pad, h - 56);
  ctx.textAlign = 'left';
}

function drawPillRow(
  ctx: CanvasRenderingContext2D,
  items: string[],
  startX: number,
  startY: number,
  maxWidth: number,
  invertedFirst = false
) {
  let x = startX;
  let y = startY;
  ctx.font = '600 23px "Geist Mono Variable", monospace';
  ctx.textBaseline = 'middle';

  items.forEach((item, idx) => {
    const tw = ctx.measureText(item).width;
    const pw = tw + 42;
    const ph = 50;
    if (x + pw > startX + maxWidth && x > startX) {
      x = startX;
      y += ph + 14;
    }
    drawRoundedRect(ctx, x, y, pw, ph, 25);
    if (invertedFirst && idx === 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.fillStyle = '#0D0E10';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#EDEFF3';
    }
    ctx.textAlign = 'center';
    ctx.fillText(item, x + pw / 2, y + ph / 2 + 1);
    x += pw + 14;
  });
  ctx.textAlign = 'left';
}

function drawNumberedBentoCards(
  ctx: CanvasRenderingContext2D,
  cards: Array<{ index: string; heading?: string; body: string }>,
  x: number,
  y: number,
  w: number,
  availH: number
) {
  const count = Math.max(1, cards.length);
  const gap = 22;
  const cardH = Math.min(260, (availH - gap * (count - 1)) / count);

  cards.forEach((card, i) => {
    const cy = y + i * (cardH + gap);
    drawRoundedRect(ctx, x, cy, w, cardH, 20);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Left pure white accent bar
    ctx.fillStyle = i === 0 ? '#FFFFFF' : '#7E8490';
    ctx.fillRect(x, cy + 22, 4, cardH - 44);

    // Index circle
    ctx.fillStyle = i === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(x + 52, cy + 52, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = i === 0 ? '#0D0E10' : '#FFFFFF';
    ctx.font = '700 20px "Geist Mono Variable", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.index, x + 52, cy + 53);
    ctx.textAlign = 'left';

    let textY = cy + 38;
    if (card.heading) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 30px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(card.heading, x + 98, textY, w - 132);
      textY += 46;
    }

    ctx.fillStyle = '#D8DCE4';
    ctx.font = '400 28px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.textBaseline = 'top';
    const maxLines = card.heading ? 3 : 4;
    const lines = wrapLines(ctx, card.body, w - 136, maxLines);
    lines.forEach((ln, li) => {
      ctx.fillText(ln, x + 98, textY + li * 39);
    });
  });
}

/* ---------- Bespoke Vector Diagrams for Slide 0 ---------- */

function drawIdentityEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  // Architectural concentric meridian & compass circles
  [1, 0.76, 0.52].forEach((scale, idx) => {
    ctx.strokeStyle =
      idx === 0 ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.14)';
    ctx.lineWidth = idx === 0 ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Crosshair precision axes
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - r * 1.18, cy);
  ctx.lineTo(cx + r * 1.18, cy);
  ctx.moveTo(cx, cy - r * 1.18);
  ctx.lineTo(cx, cy + r * 1.18);
  ctx.stroke();

  // Central Pure White Monogram Seal
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0D0E10';
  ctx.font = '700 62px "Plus Jakarta Sans Variable", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LA', cx, cy + 2);
  ctx.textAlign = 'left';
}

function drawTimelineTrajectoryArt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  activeStepOneBased: number
) {
  drawRoundedRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Horizontal grid lines
  for (let g = 1; g <= 3; g++) {
    const gy = y + (h * g) / 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.moveTo(x + 48, gy);
    ctx.lineTo(x + w - 48, gy);
    ctx.stroke();
  }

  // 6 ascending nodes
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const px = x + 96 + (i * (w - 192)) / 5;
    const py = y + h - 88 - (i * (h - 190)) / 5;
    pts.push([px, py]);
  }

  // Connecting trajectory line
  ctx.strokeStyle = 'rgba(255,255,255,0.32)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  pts.forEach(([px, py], i) => {
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Draw each node + highlight active milestone
  pts.forEach(([px, py], i) => {
    const isCurrent = i + 1 === activeStepOneBased;
    if (isCurrent) {
      // Vertical drop line
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, y + h - 46);
      ctx.stroke();

      // Halo ring
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, py, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = i + 1 < activeStepOneBased ? '#C8CCD4' : '#4E535E';
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = isCurrent ? '#FFFFFF' : '#8E94A0';
    ctx.font = `${isCurrent ? '700' : '500'} 20px "Geist Mono Variable", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`0${i + 1}`, px, y + h - 24);
  });
  ctx.textAlign = 'left';
}

function drawSkillDomainSchematic(
  ctx: CanvasRenderingContext2D,
  domainId: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  drawRoundedRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const cx = x + w / 2;
  const cy = y + h / 2;

  if (domainId === 'finance') {
    // Valuation Cash-Flow Bars + Yield Curve
    const heights = [0.28, 0.42, 0.38, 0.58, 0.72, 0.86];
    const bw = 74;
    const gap = 38;
    const startX = cx - (heights.length * bw + (heights.length - 1) * gap) / 2;
    heights.forEach((ratio, idx) => {
      const bh = (h - 140) * ratio;
      const bx = startX + idx * (bw + gap);
      const by = y + h - 64 - bh;
      drawRoundedRect(ctx, bx, by, bw, bh, 8);
      ctx.fillStyle = idx === heights.length - 1 ? '#FFFFFF' : 'rgba(255,255,255,0.18)';
      ctx.fill();
    });
    // Smooth valuation curve
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    heights.forEach((ratio, idx) => {
      const px = startX + idx * (bw + gap) + bw / 2;
      const py = y + h - 84 - (h - 150) * ratio;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  } else if (domainId === 'accounting') {
    // Balanced T-Ledger + Analytical Ring
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 90, y + 90);
    ctx.lineTo(x + w - 90, y + 90);
    ctx.moveTo(cx, y + 90);
    ctx.lineTo(cx, y + h - 70);
    ctx.stroke();

    for (let r = 0; r < 4; r++) {
      const ry = y + 135 + r * 62;
      ctx.fillStyle = r === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.18)';
      drawRoundedRect(ctx, x + 120, ry, cx - x - 165, 34, 6);
      ctx.fill();
      drawRoundedRect(ctx, cx + 45, ry, cx - x - 165, 34, 6);
      ctx.fill();
    }
  } else if (domainId === 'audit') {
    // Concentric Control Radar Polygon
    [0.36, 0.24, 0.12].forEach((s) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * s * 1.15, 0, Math.PI * 2);
      ctx.stroke();
    });
    const radii = [0.38, 0.34, 0.4, 0.32, 0.39, 0.36];
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    radii.forEach((rv, i) => {
      const ang = (i * Math.PI * 2) / 6 - Math.PI / 2;
      const rad = Math.min(w, h) * rv * 1.05;
      const px = cx + Math.cos(ang) * rad;
      const py = cy + Math.sin(ang) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (domainId === 'modeling') {
    // Structured Spreadsheet Matrix + KPI Nodes
    const cols = 4;
    const rows = 4;
    const cw = (w - 200) / cols;
    const ch = (h - 140) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const gx = x + 100 + c * cw;
        const gy = y + 70 + r * ch;
        drawRoundedRect(ctx, gx + 6, gy + 6, cw - 12, ch - 12, 8);
        ctx.fillStyle =
          r === 0 || (r === 2 && c === 3)
            ? 'rgba(255,255,255,0.85)'
            : 'rgba(255,255,255,0.09)';
        ctx.fill();
      }
    }
  } else if (domainId === 'information-systems') {
    // 3-Tier SI Architecture Flow
    const labels = ['INTERFACE MÉTIER', 'LOGIQUE & CONTRÔLE', 'BASE DE DONNÉES'];
    labels.forEach((lbl, idx) => {
      const bx = x + 140;
      const bw = w - 280;
      const bh = 78;
      const by = y + 66 + idx * 118;
      drawRoundedRect(ctx, bx, by, bw, bh, 14);
      ctx.fillStyle = idx === 1 ? '#FFFFFF' : 'rgba(255,255,255,0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.stroke();

      ctx.fillStyle = idx === 1 ? '#0D0E10' : '#FFFFFF';
      ctx.font = '700 22px "Geist Mono Variable", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lbl, cx, by + bh / 2);
    });
    ctx.textAlign = 'left';
  } else {
    // Web & Product Modular UI Wireframe
    drawRoundedRect(ctx, x + 110, y + 58, w - 220, h - 116, 18);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, x + 145, y + 96, (w - 310) * 0.56, h - 192, 12);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    drawRoundedRect(
      ctx,
      x + 165 + (w - 310) * 0.56,
      y + 96,
      (w - 310) * 0.4,
      (h - 210) / 2,
      12
    );
    ctx.fill();
    drawRoundedRect(
      ctx,
      x + 165 + (w - 310) * 0.56,
      y + 114 + (h - 210) / 2,
      (w - 310) * 0.4,
      (h - 210) / 2,
      12
    );
    ctx.fill();
  }
}

function drawMethodBlueprintArt(
  ctx: CanvasRenderingContext2D,
  activeStep: number,
  x: number,
  y: number,
  w: number,
  h: number
) {
  drawRoundedRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const cy = y + h / 2;
  const startX = x + 105;
  const stepGap = (w - 210) / 5;

  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, cy);
  ctx.lineTo(startX + stepGap * 5, cy);
  ctx.stroke();

  for (let i = 0; i < 6; i++) {
    const px = startX + i * stepGap;
    const isActive = i + 1 === activeStep;

    ctx.beginPath();
    ctx.arc(px, cy, isActive ? 46 : 30, 0, Math.PI * 2);
    if (isActive) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    } else {
      ctx.fillStyle = '#121418';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.34)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = isActive ? '#0D0E10' : '#B8BDC7';
    ctx.font = '700 24px "Geist Mono Variable", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`0${i + 1}`, px, cy + 1);
  }
  ctx.textAlign = 'left';
}

/**
 * Generates the bespoke high-resolution 3-slide CanvasTexture for ANY of the
 * 24 Suspended Titanium Tableaux (`slideIndex`: `0 | 1 | 2`).
 */
export function createSuspendedTableauTexture(
  station: WorldStation3D,
  slideIndex = 0,
  visualIndex = 0,
  maxAnisotropy = 16
): THREE.CanvasTexture {
  if (station.kind === 'project' && station.project) {
    return createProjectTableauSlideTexture(
      station.project,
      slideIndex,
      visualIndex,
      maxAnisotropy
    );
  }

  const isLandscape = station.kind === 'contact';
  const w = isLandscape ? 1920 : 1440;
  const h = isLandscape ? 1280 : 1800;
  const pad = Math.round(w * 0.062);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return configureCrispSignTexture(canvas, maxAnisotropy);

  // Slide Labels per Station Kind
  const slideLabels: [string, string, string] =
    station.kind === 'identity'
      ? ['PROFIL', 'VISION', 'ATOUTS']
      : station.kind === 'milestone'
        ? ['JALON', 'MISSIONS', 'OUTILS']
        : station.kind === 'skill'
          ? ['DOMAINE', 'SOCLE', 'PRATIQUE']
          : station.kind === 'method'
            ? ['ÉTAPE', 'ACTIONS', 'CAS RÉEL']
            : ['DIRECT', 'RÉSEAUX', 'DOMAINES'];

  drawSwissHeaderAndFooter(
    ctx,
    w,
    h,
    station.code,
    station.badge,
    slideIndex,
    slideLabels
  );

  // ================= A. IDENTITY =================
  if (station.kind === 'identity') {
    if (slideIndex === 0) {
      drawIdentityEmblem(ctx, w / 2, 520, 235);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 94px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(PROFILE_IDENTITY.fullName, w / 2, 875);

      ctx.fillStyle = '#C8CCD4';
      ctx.font = '400 36px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.fillText(
        'Cycle Ingénieur en Finance (3e année) · INP-HB',
        w / 2,
        1005
      );

      ctx.textAlign = 'left';
      drawPillRow(
        ctx,
        ['AUDIT & CONTRÔLE', 'ANALYSE FINANCIÈRE', 'OUTILS DIGITAUX'],
        pad + 55,
        1160,
        w - pad * 2 - 110,
        true
      );
    } else if (slideIndex === 1) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 62px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Positionnement & Orientation', pad, 185);

      drawNumberedBentoCards(
        ctx,
        [
          {
            index: '01',
            heading: 'Double culture Finance & Digital',
            body: PROFILE_IDENTITY.about.personalPresentation,
          },
          {
            index: '02',
            heading: 'Approche orientée solutions',
            body: PROFILE_IDENTITY.about.personalBridge,
          },
          {
            index: '03',
            heading: PROFILE_IDENTITY.about.professionalOrientationTitle,
            body: PROFILE_IDENTITY.about.professionalOrientationText,
          },
        ],
        pad,
        310,
        w - pad * 2,
        1320
      );
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 62px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Qualités & Repères Clés', pad, 185);

      drawNumberedBentoCards(
        ctx,
        PROFILE_IDENTITY.about.qualities.map((q, idx) => ({
          index: `0${idx + 1}`,
          heading: q,
          body:
            idx === 0
              ? 'Lecture structurée des états financiers, écarts et indicateurs de performance.'
              : idx === 1
                ? 'Application rigoureuse des normes comptables, procédures d’audit et contrôles.'
                : idx === 2
                  ? 'Capacité à relier les besoins métiers financiers aux outils numériques modernes.'
                  : 'Organisation claire des livrables, reportings et tableaux de suivi.',
        })),
        pad,
        310,
        w - pad * 2,
        1320
      );
    }
  }

  // ================= B. MILESTONE =================
  else if (station.kind === 'milestone' && station.milestone) {
    const m = station.milestone;
    const stepNum = parseInt(m.order, 10) || 1;

    if (slideIndex === 0) {
      // Monumental Year & Step Index
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 132px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(m.order, pad, 175);

      ctx.fillStyle = '#B8BDC7';
      ctx.font = '600 32px "Geist Mono Variable", monospace';
      ctx.fillText(m.period.toUpperCase(), pad + 215, 210);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 30px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.fillText(m.organization, pad + 215, 260, w - pad * 2 - 220);

      // Bespoke Trajectory Vector Graphic
      drawTimelineTrajectoryArt(ctx, pad, 375, w - pad * 2, 470, stepNum);

      // Clean Title & Short Summary
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 58px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      const tLines = wrapLines(ctx, m.title, w - pad * 2, 3);
      tLines.forEach((ln, idx) => {
        ctx.fillText(ln, pad, 910 + idx * 70);
      });

      const subY = 910 + tLines.length * 70 + 36;
      ctx.fillStyle = '#C8CCD4';
      ctx.font = '400 32px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      const sLines = wrapLines(ctx, m.summary, w - pad * 2, 3);
      sLines.forEach((ln, idx) => {
        ctx.fillText(ln, pad, subY + idx * 46);
      });
    } else if (slideIndex === 1) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 56px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(
        station.internship ? 'Missions Réalisées en Stage' : 'Acquis & Points Clés',
        pad,
        185
      );

      const items = station.internship
        ? station.internship.missions
        : m.details;
      drawNumberedBentoCards(
        ctx,
        items.slice(0, 4).map((txt, idx) => ({
          index: `0${idx + 1}`,
          body: txt,
        })),
        pad,
        305,
        w - pad * 2,
        1320
      );
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 56px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Cadre & Outils Mobilisés', pad, 185);

      const cards = [
        {
          index: '01',
          heading: 'Établissement / Organisation',
          body: `${m.organization} — Période : ${m.period}`,
        },
        ...(station.internship
          ? [
              {
                index: '02',
                heading: `${station.internship.role} (${station.internship.duration})`,
                body: `Outils pratiqués : ${station.internship.toolsUsed.join(' · ')}`,
              },
            ]
          : [
              {
                index: '02',
                heading: 'Synthèse du jalon',
                body: m.summary,
              },
            ]),
      ];

      drawNumberedBentoCards(ctx, cards, pad, 305, w - pad * 2, 680);

      const tools =
        station.internship?.toolsUsed ??
        m.toolsOrContext ?? [m.organization, m.period];
      drawPillRow(ctx, tools, pad, 1070, w - pad * 2, true);
    }
  }

  // ================= C. SKILL =================
  else if (station.kind === 'skill' && station.skill) {
    const sk = station.skill;

    if (slideIndex === 0) {
      drawSkillDomainSchematic(ctx, sk.id, pad, 185, w - pad * 2, 560);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 60px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      const tLines = wrapLines(ctx, sk.title, w - pad * 2, 2);
      tLines.forEach((ln, idx) => {
        ctx.fillText(ln, pad, 815 + idx * 72);
      });

      const sumY = 815 + tLines.length * 72 + 34;
      ctx.fillStyle = '#C8CCD4';
      ctx.font = '400 32px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      const sLines = wrapLines(ctx, sk.summary, w - pad * 2, 3);
      sLines.forEach((ln, idx) => {
        ctx.fillText(ln, pad, sumY + idx * 46);
      });

      drawPillRow(ctx, sk.toolsContext, pad, 1280, w - pad * 2, true);
    } else if (slideIndex === 1) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 56px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Socle Académique (INP-HB)', pad, 185);

      drawNumberedBentoCards(
        ctx,
        sk.academicFoundations.slice(0, 4).map((a, idx) => ({
          index: `0${idx + 1}`,
          body: a,
        })),
        pad,
        305,
        w - pad * 2,
        1320
      );
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 56px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Mise en Pratique & Outils', pad, 185);

      drawNumberedBentoCards(
        ctx,
        sk.practicalExperience.slice(0, 3).map((p, idx) => ({
          index: `0${idx + 1}`,
          body: p,
        })),
        pad,
        305,
        w - pad * 2,
        940
      );

      drawPillRow(ctx, sk.toolsContext, pad, 1320, w - pad * 2, true);
    }
  }

  // ================= E. METHOD =================
  else if (station.kind === 'method' && station.methodStep) {
    const ms = station.methodStep;
    const stepNum = parseInt(ms.step, 10) || 1;

    if (slideIndex === 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 132px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(ms.step, pad, 175);

      ctx.fillStyle = '#B8BDC7';
      ctx.font = '600 28px "Geist Mono Variable", monospace';
      ctx.fillText('CYCLE MÉTHODOLOGIQUE EN 6 ÉTAPES', pad + 215, 228);

      drawMethodBlueprintArt(ctx, stepNum, pad, 365, w - pad * 2, 420);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 60px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      const tLines = wrapLines(ctx, ms.title, w - pad * 2, 2);
      tLines.forEach((ln, idx) => {
        ctx.fillText(ln, pad, 860 + idx * 72);
      });

      const objY = 860 + tLines.length * 72 + 36;
      ctx.fillStyle = '#C8CCD4';
      ctx.font = '400 33px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      const oLines = wrapLines(ctx, ms.objective, w - pad * 2, 4);
      oLines.forEach((ln, idx) => {
        ctx.fillText(ln, pad, objY + idx * 48);
      });
    } else if (slideIndex === 1) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 56px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Actions & Décisions Clés', pad, 185);

      drawNumberedBentoCards(
        ctx,
        ms.actions.map((a, idx) => ({
          index: `0${idx + 1}`,
          body: a,
        })),
        pad,
        305,
        w - pad * 2,
        1300
      );
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 56px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Application Réelle', pad, 185);

      drawNumberedBentoCards(
        ctx,
        [
          {
            index: '01',
            heading: ms.realExample.projectOrContext,
            body: ms.realExample.illustration,
          },
          {
            index: '02',
            heading: 'Objectif visé',
            body: ms.objective,
          },
        ],
        pad,
        320,
        w - pad * 2,
        920
      );
    }
  }

  // ================= F. CONTACT (LANDSCAPE 1920x1280 — ZERO CV) =================
  else if (station.kind === 'contact') {
    if (slideIndex === 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 72px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Contact & Coordonnées Directes', pad, 185);

      ctx.fillStyle = '#B8BDC7';
      ctx.font = '400 32px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.fillText(PROFILE_IDENTITY.contacts.lead, pad, 285, w - pad * 2);

      // Two large architectural contact cards side by side
      const cw = (w - pad * 2 - 36) / 2;
      const cards = [
        {
          label: 'COURRIEL DIRECT',
          val: PROFILE_IDENTITY.contacts.email,
          sub: 'Réponse rapide · Échanges professionnels & académiques',
        },
        {
          label: 'TÉLÉPHONE (CÔTE D’IVOIRE)',
          val: PROFILE_IDENTITY.contacts.phonePrimary,
          sub: `Ligne secondaire : ${PROFILE_IDENTITY.contacts.phoneSecondary}`,
        },
      ];
      cards.forEach((c, idx) => {
        const cx = pad + idx * (cw + 36);
        drawRoundedRect(ctx, cx, 420, cw, 540, 24);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fill();
        ctx.strokeStyle = idx === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#9CA1AB';
        ctx.font = '600 24px "Geist Mono Variable", monospace';
        ctx.fillText(c.label, cx + 48, 490);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 46px "Plus Jakarta Sans Variable", system-ui, sans-serif';
        ctx.fillText(c.val, cx + 48, 600, cw - 96);

        ctx.fillStyle = '#C8CCD4';
        ctx.font = '400 28px "Plus Jakarta Sans Variable", system-ui, sans-serif';
        ctx.fillText(c.sub, cx + 48, 720, cw - 96);
      });
    } else if (slideIndex === 1) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 64px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Présence Numérique & Réseaux', pad, 185);

      drawNumberedBentoCards(
        ctx,
        [
          {
            index: '01',
            heading: 'LinkedIn',
            body: PROFILE_IDENTITY.contacts.linkedinLabel,
          },
          {
            index: '02',
            heading: 'GitHub',
            body: 'github.com/loichermanna-art — Projets web & architectures métier',
          },
          {
            index: '03',
            heading: 'Localisation & Institution',
            body: 'INP-HB (École Supérieure de Commerce et d’Administration des Entreprises) · Côte d’Ivoire',
          },
        ],
        pad,
        300,
        w - pad * 2,
        820
      );
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 64px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText('Axes de Collaboration', pad, 185);

      drawNumberedBentoCards(
        ctx,
        [
          {
            index: '01',
            heading: 'Audit, Contrôle de Gestion & Analyse Financière',
            body: 'Diagnostic financier, suivi budgétaire, procédures de contrôle interne et reporting.',
          },
          {
            index: '02',
            heading: 'Comptabilité & Modélisation',
            body: 'Tenue et révision comptable (Sage 100), automatisation de tableaux de bord Excel.',
          },
          {
            index: '03',
            heading: 'Digitalisation & Applications Métier',
            body: 'Conception d’interfaces et plateformes web structurées répondant à des besoins concrets.',
          },
        ],
        pad,
        300,
        w - pad * 2,
        820
      );
    }
  }

  return configureCrispSignTexture(canvas, maxAnisotropy);
}

/**
 * 2K (`2048×1280`) Widescreen 3-Slide Exhibition Board for the 4 Live Projects.
 */
function createProjectTableauSlideTexture(
  project: ProjectCaseStudy,
  slideIndex = 0,
  visualIndex = 0,
  maxAnisotropy = 16
): THREE.CanvasTexture {
  const w = 2048;
  const h = 1280;
  const pad = 92;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return configureCrispSignTexture(canvas, maxAnisotropy);

  drawSwissHeaderAndFooter(
    ctx,
    w,
    h,
    `PROJET ${project.index}`,
    project.category,
    slideIndex,
    ['VISUEL', 'ANALYSE', 'STACK']
  );

  // SLIDE 0: 75% Cinema Visual Artwork + Crisp Bottom Museum Cartel
  if (slideIndex === 0) {
    const imgX = pad;
    const imgY = 164;
    const imgW = w - pad * 2;
    const imgH = 760;

    drawRoundedRect(ctx, imgX, imgY, imgW, imgH, 22);
    ctx.fillStyle = '#07080A';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Immediate crisp editorial poster inside viewport before async image loads
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 84px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(project.name, w / 2, imgY + imgH * 0.44);

    ctx.fillStyle = '#B8BDC7';
    ctx.font = '400 30px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.fillText(project.oneLinePitch, w / 2, imgY + imgH * 0.58, imgW - 160);
    ctx.textAlign = 'left';

    // Bottom Cartel Strip
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 54px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(project.name, pad, 964);

    ctx.fillStyle = '#B8BDC7';
    ctx.font = '400 28px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.fillText(project.oneLinePitch, pad, 1036, w - pad * 2 - 420);

    // Live URL Pill on Bottom-Right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 26px "Geist Mono Variable", monospace';
    ctx.fillText(`${project.liveUrlLabel} ↗`, w - pad, 982);
    ctx.textAlign = 'left';

    const tex = configureCrispSignTexture(canvas, maxAnisotropy);
    const activeVisual = project.visuals[visualIndex % project.visuals.length];

    if (typeof Image !== 'undefined' && activeVisual?.src) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        drawRoundedRect(ctx, imgX + 4, imgY + 4, imgW - 8, imgH - 8, 18);
        ctx.clip();
        ctx.fillStyle = '#07080A';
        ctx.fillRect(imgX, imgY, imgW, imgH);

        const iw = img.naturalWidth || 1600;
        const ih = img.naturalHeight || 900;
        const scale = Math.min((imgW - 24) / iw, (imgH - 24) / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = imgX + (imgW - dw) / 2;
        const dy = imgY + (imgH - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        ctx.strokeStyle = 'rgba(255,255,255,0.24)';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, imgX, imgY, imgW, imgH, 22);
        ctx.stroke();

        tex.needsUpdate = true;
      };
      img.src = activeVisual.src;
    }
    return tex;
  }

  // SLIDE 1: 2-Column Case-Study Analysis (Context/Problem vs Contribution/Real Operation)
  if (slideIndex === 1) {
    const colW = (w - pad * 2 - 40) / 2;
    const colY = 178;
    const colH = 955;

    // Left Column: Contexte & Problématique
    drawRoundedRect(ctx, pad, colY, colW, colH, 24);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#9CA1AB';
    ctx.font = '700 22px "Geist Mono Variable", monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('01 · CONTEXTE', pad + 44, colY + 42);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '400 29px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    const ctxLines = wrapLines(ctx, project.context, colW - 88, 6);
    ctxLines.forEach((ln, i) => ctx.fillText(ln, pad + 44, colY + 92 + i * 42));

    ctx.fillStyle = '#9CA1AB';
    ctx.font = '700 22px "Geist Mono Variable", monospace';
    ctx.fillText('02 · PROBLÉMATIQUE', pad + 44, colY + 440);

    ctx.fillStyle = '#D8DCE4';
    ctx.font = '400 29px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    const prbLines = wrapLines(ctx, project.problem, colW - 88, 7);
    prbLines.forEach((ln, i) => ctx.fillText(ln, pad + 44, colY + 490 + i * 42));

    // Right Column: Contribution & Fonctionnement réel
    const rx = pad + colW + 40;
    drawRoundedRect(ctx, rx, colY, colW, colH, 24);
    ctx.fillStyle = 'rgba(255,255,255,0.055)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.24)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 22px "Geist Mono Variable", monospace';
    ctx.fillText('03 · CONTRIBUTION PERSONNELLE', rx + 44, colY + 42);

    ctx.fillStyle = '#EDEFF3';
    ctx.font = '400 29px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    const conLines = wrapLines(
      ctx,
      project.personalContribution,
      colW - 88,
      project.operationalNote ? 6 : 10
    );
    conLines.forEach((ln, i) => ctx.fillText(ln, rx + 44, colY + 92 + i * 42));

    if (project.operationalNote) {
      drawRoundedRect(ctx, rx + 36, colY + 470, colW - 72, 430, 18);
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(rx + 36, colY + 494, 4, 382);

      ctx.font = '700 22px "Geist Mono Variable", monospace';
      ctx.fillText('FONCTIONNEMENT RÉEL VÉRIFIÉ', rx + 68, colY + 506);

      ctx.fillStyle = '#EDEFF3';
      ctx.font = '400 27px "Plus Jakarta Sans Variable", system-ui, sans-serif';
      const opLines = wrapLines(ctx, project.operationalNote, colW - 136, 7);
      opLines.forEach((ln, i) => ctx.fillText(ln, rx + 68, colY + 556 + i * 40));
    }

    return configureCrispSignTexture(canvas, maxAnisotropy);
  }

  // SLIDE 2: Bento Grid of Verified Features + Tech Stack Pills
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 50px "Plus Jakarta Sans Variable", system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(`${project.name} — Fonctionnalités & Technologies`, pad, 172);

  const feats = project.verifiedFeatures.slice(0, 4);
  const cardW = (w - pad * 2 - 32) / 2;
  const cardH = 305;

  feats.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = pad + col * (cardW + 32);
    const cy = 264 + row * (cardH + 28);

    drawRoundedRect(ctx, cx, cy, cardW, cardH, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.045)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 22px "Geist Mono Variable", monospace';
    ctx.fillText(`0${idx + 1}`, cx + 36, cy + 34);

    ctx.fillStyle = '#E6E8EC';
    ctx.font = '400 29px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    const lines = wrapLines(ctx, f, cardW - 72, 4);
    lines.forEach((ln, li) => ctx.fillText(ln, cx + 36, cy + 84 + li * 42));
  });

  drawPillRow(
    ctx,
    project.technologies.map((t) => t.label),
    pad,
    968,
    w - pad * 2,
    true
  );

  return configureCrispSignTexture(canvas, maxAnisotropy);
}
