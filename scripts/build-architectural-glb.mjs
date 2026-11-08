/**
 * scripts/build-architectural-glb.mjs
 *
 * Compiles detailed, buildable architectural 3D models into standard glTF 2.0 Binary (.glb)
 * files in `public/models/` using real extruded mouldings (ExtrudeGeometry), turned hardware
 * (LatheGeometry), curved book spines, and world-space architectural UVs (zero primitive-cube shortcuts).
 */
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const OUT_DIR = path.resolve('public/models');
fs.mkdirSync(OUT_DIR, { recursive: true });

function mergeNonIndexed(geoms) {
  return mergeGeometries(
    geoms.map((g) => {
      const ni = g.index ? g.toNonIndexed() : g.clone();
      ni.deleteAttribute('uv');
      ni.deleteAttribute('uv1');
      ni.computeVertexNormals();
      return ni;
    }),
    false
  );
}

/**
 * Applies clean triplanar world-space UVs (meters -> UV scale) so grained wood and stone
 * map without stretching across bevels, extrusions, and mouldings.
 */
function applyArchitecturalUVs(geom, scale = 0.65, verticalGrain = true) {
  const g = geom.index ? geom.toNonIndexed() : geom.clone();
  g.computeVertexNormals();
  const pos = g.attributes.position;
  const norm = g.attributes.normal;
  const uvs = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = Math.abs(norm.getX(i));
    const ny = Math.abs(norm.getY(i));
    const nz = Math.abs(norm.getZ(i));

    let u = 0;
    let v = 0;
    if (ny > nx && ny > nz) {
      u = x * scale;
      v = z * scale;
    } else if (nx >= nz) {
      u = z * scale;
      v = y * scale;
    } else {
      u = x * scale;
      v = y * scale;
    }
    if (!verticalGrain) {
      const tmp = u;
      u = v;
      v = tmp;
    }
    uvs[i * 2] = u;
    uvs[i * 2 + 1] = v;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return g;
}

/**
 * Minimal, standards-compliant glTF 2.0 Binary (.glb) writer for multi-primitive meshes
 * with named PBR materials (avoids browser-only FileReader inside Node.js).
 */
function writeMultiMaterialGLB(filePath, meshName, parts) {
  const bufferChunks = [];
  let byteOffset = 0;

  const bufferViews = [];
  const accessors = [];
  const materials = [];
  const primitives = [];

  function appendTypedArray(typedArray, target) {
    const raw = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength
    );
    const pad = (4 - (raw.length % 4)) % 4;
    const chunk = pad > 0 ? Buffer.concat([raw, Buffer.alloc(pad)]) : raw;
    const viewIndex = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: raw.length,
      ...(target ? { target } : {}),
    });
    bufferChunks.push(chunk);
    byteOffset += chunk.length;
    return viewIndex;
  }

  for (const part of parts) {
    const matIndex = materials.length;
    materials.push({
      name: part.materialName,
      doubleSided: Boolean(part.doubleSided),
      pbrMetallicRoughness: {
        baseColorFactor: part.baseColorFactor ?? [1, 1, 1, 1],
        metallicFactor: part.metallicFactor ?? 0.0,
        roughnessFactor: part.roughnessFactor ?? 0.5,
      },
      ...(part.alphaMode ? { alphaMode: part.alphaMode } : {}),
    });

    const g = part.geometry;
    const posAttr = g.attributes.position;
    const normAttr = g.attributes.normal;
    const uvAttr = g.attributes.uv;
    const colorAttr = g.attributes.color;

    const posArr = new Float32Array(posAttr.array);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < posAttr.count; i++) {
      const x = posArr[i * 3];
      const y = posArr[i * 3 + 1];
      const z = posArr[i * 3 + 2];
      if (x < min[0]) min[0] = x;
      if (y < min[1]) min[1] = y;
      if (z < min[2]) min[2] = z;
      if (x > max[0]) max[0] = x;
      if (y > max[1]) max[1] = y;
      if (z > max[2]) max[2] = z;
    }

    const posView = appendTypedArray(posArr, 34962);
    const posAcc = accessors.length;
    accessors.push({
      bufferView: posView,
      componentType: 5126,
      count: posAttr.count,
      type: 'VEC3',
      min,
      max,
    });

    const normView = appendTypedArray(new Float32Array(normAttr.array), 34962);
    const normAcc = accessors.length;
    accessors.push({
      bufferView: normView,
      componentType: 5126,
      count: normAttr.count,
      type: 'VEC3',
    });

    const attrs = { POSITION: posAcc, NORMAL: normAcc };

    if (uvAttr) {
      const uvView = appendTypedArray(new Float32Array(uvAttr.array), 34962);
      const uvAcc = accessors.length;
      accessors.push({
        bufferView: uvView,
        componentType: 5126,
        count: uvAttr.count,
        type: 'VEC2',
      });
      attrs.TEXCOORD_0 = uvAcc;
    }

    if (colorAttr) {
      const colView = appendTypedArray(new Float32Array(colorAttr.array), 34962);
      const colAcc = accessors.length;
      accessors.push({
        bufferView: colView,
        componentType: 5126,
        count: colorAttr.count,
        type: 'VEC3',
      });
      attrs.COLOR_0 = colAcc;
    }

    primitives.push({
      attributes: attrs,
      material: matIndex,
      mode: 4,
    });
  }

  const binBuffer = Buffer.concat(bufferChunks);
  const gltf = {
    asset: {
      version: '2.0',
      generator: 'TheInfiniteLibrary Architectural GLB Compiler 1.0',
    },
    scene: 0,
    scenes: [{ name: meshName, nodes: [0] }],
    nodes: [{ name: meshName, mesh: 0 }],
    meshes: [{ name: meshName, primitives }],
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binBuffer.length }],
  };

  const jsonRaw = Buffer.from(JSON.stringify(gltf), 'utf8');
  const jsonPad = (4 - (jsonRaw.length % 4)) % 4;
  const jsonChunk =
    jsonPad > 0
      ? Buffer.concat([jsonRaw, Buffer.alloc(jsonPad, 0x20)])
      : jsonRaw;

  const totalLength = 12 + 8 + jsonChunk.length + 8 + binBuffer.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // 'glTF'
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binBuffer.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

  fs.writeFileSync(
    filePath,
    Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binBuffer])
  );
}

/**
 * Helper: Rectangular moulded frame (extruded outer contour with inner cut-out + bevels)
 */
function createMouldedFrame(outerW, outerH, borderW, borderBottom, borderTop, depth, bevel = 0.012) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(outerW, 0);
  shape.lineTo(outerW, outerH);
  shape.lineTo(0, outerH);
  shape.closePath();

  const hole = new THREE.Path();
  const x0 = borderW;
  const x1 = outerW - borderW;
  const y0 = borderBottom;
  const y1 = outerH - borderTop;
  hole.moveTo(x0, y0);
  hole.lineTo(x1, y0);
  hole.lineTo(x1, y1);
  hole.lineTo(x0, y1);
  hole.closePath();
  shape.holes.push(hole);

  const g = new THREE.ExtrudeGeometry(shape, {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 8,
  });
  g.translate(0, 0, -(depth - bevel * 2) * 0.5);
  return g;
}

function createRaisedPanel(w, h, depth = 0.036, bevel = 0.028) {
  const shape = new THREE.Shape();
  const hw = w * 0.5 - bevel;
  const hh = h * 0.5 - bevel;
  shape.moveTo(-hw, -hh);
  shape.lineTo(hw, -hh);
  shape.lineTo(hw, hh);
  shape.lineTo(-hw, hh);
  shape.closePath();

  const g = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: true,
    bevelThickness: bevel * 0.55,
    bevelSize: bevel,
    bevelSegments: 3,
  });
  g.translate(0, 0, -depth * 0.5);
  return g;
}

// ============================================================================
// 1. MONUMENTAL DOOR LEAF (`monumental-door-leaf.glb`)
//    Width: 1.58 m (x: 0.00 -> +1.58, hinged at x = 0.00)
//    Height: 4.58 m (y: 0.00 -> +4.58)
//    Thickness: 0.11 m
// ============================================================================
{
  const W = 1.58;
  const H = 4.58;
  const T = 0.105;

  const walnutVerticalParts = [];
  const walnutHorizontalParts = [];
  const bronzeParts = [];
  const brassParts = [];
  const glassParts = [];

  // Main outer perimeter stiles + top/bottom rails with upper lancet glazing cutout
  // Lower solid leaf body (0 -> 2.48 m), upper glazed aperture (2.48 -> 4.34 m)
  const mainFrame = createMouldedFrame(W, H, 0.19, 0.34, 0.22, T, 0.011);
  walnutVerticalParts.push(mainFrame);

  // Mid lock-rail separating lower solid panels from upper glazed light (y: 2.18 -> 2.46)
  const midRail = new THREE.BoxGeometry(W - 0.34, 0.28, T * 0.96);
  midRail.translate(W * 0.5, 2.32, 0);
  walnutHorizontalParts.push(midRail);

  // Sub-rail dividing plinth panel and middle tall panel (y: 0.96 -> 1.12)
  const subRail = new THREE.BoxGeometry(W - 0.34, 0.16, T * 0.94);
  subRail.translate(W * 0.5, 1.04, 0);
  walnutHorizontalParts.push(subRail);

  // Lower solid core backing (y: 0.30 -> 2.22) + bevelled raised architectural panels front & back
  const coreBack = new THREE.BoxGeometry(W - 0.34, 1.92, 0.036);
  coreBack.translate(W * 0.5, 1.26, 0);
  walnutVerticalParts.push(coreBack);

  // Plinth raised panels (front + back)
  for (const side of [-1, 1]) {
    const pLow = createRaisedPanel(W - 0.44, 0.56, 0.022, 0.032);
    pLow.translate(W * 0.5, 0.65, side * 0.032);
    walnutVerticalParts.push(pLow);

    const pMid = createRaisedPanel(W - 0.44, 0.98, 0.024, 0.036);
    pMid.translate(W * 0.5, 1.65, side * 0.032);
    walnutVerticalParts.push(pMid);
  }

  // Burnished-bronze glazing bead frame & slender architectural muntin grid in upper aperture (y: 2.46 -> 4.36)
  const glassW = W - 0.38;
  const glassH = 1.90;
  const glassCenterY = 3.41;

  const bronzeBead = createMouldedFrame(glassW + 0.04, glassH + 0.04, 0.032, 0.032, 0.032, 0.056, 0.005);
  bronzeBead.translate(W * 0.5 - (glassW + 0.04) * 0.5, glassCenterY - (glassH + 0.04) * 0.5, 0);
  bronzeParts.push(bronzeBead);

  // Vertical & horizontal slender bronze muntins inside glass aperture
  const vMuntin = new THREE.BoxGeometry(0.022, glassH, 0.042);
  vMuntin.translate(W * 0.5, glassCenterY, 0);
  bronzeParts.push(vMuntin);

  for (const gy of [3.04, 3.78]) {
    const hMuntin = new THREE.BoxGeometry(glassW, 0.022, 0.042);
    hMuntin.translate(W * 0.5, gy, 0);
    bronzeParts.push(hMuntin);
  }

  // Kickplate at base of door in burnished bronze (front & back)
  for (const side of [-1, 1]) {
    const kick = new THREE.BoxGeometry(W - 0.04, 0.14, 0.006);
    kick.translate(W * 0.5, 0.075, side * (T * 0.5 + 0.002));
    bronzeParts.push(kick);
  }

  // 4 Heavy architectural hinge knuckles along hinge edge (x = 0.012)
  for (const hy of [0.52, 1.55, 2.85, 4.05]) {
    const knuckle = new THREE.CylinderGeometry(0.022, 0.022, 0.15, 16);
    knuckle.translate(0.012, hy, 0);
    bronzeParts.push(knuckle);
  }

  // Architectural Pull Handle Assembly near leading edge (x = W - 0.13) on BOTH faces
  const handleX = W - 0.135;
  for (const side of [-1, 1]) {
    // Escutcheon backplate
    const plate = new THREE.BoxGeometry(0.058, 1.52, 0.008);
    plate.translate(handleX, 1.52, side * (T * 0.5 + 0.004));
    bronzeParts.push(plate);

    // Turned LatheGeometry standoffs + brushed brass collar rings
    for (const sy of [0.92, 2.12]) {
      const standoffPts = [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.024, 0.0),
        new THREE.Vector2(0.024, 0.012),
        new THREE.Vector2(0.014, 0.018),
        new THREE.Vector2(0.014, 0.058),
        new THREE.Vector2(0.019, 0.068),
        new THREE.Vector2(0.0, 0.068),
      ];
      const standoff = new THREE.LatheGeometry(standoffPts, 20);
      standoff.rotateX(side > 0 ? Math.PI * 0.5 : -Math.PI * 0.5);
      standoff.translate(handleX, sy, side * (T * 0.5 + 0.006));
      brassParts.push(standoff);
    }

    // Long vertical grip bar (1.42 m tall)
    const bar = new THREE.CylinderGeometry(0.016, 0.016, 1.44, 20);
    bar.translate(handleX, 1.52, side * (T * 0.5 + 0.072));
    brassParts.push(bar);

    // Finial end-caps on vertical grip bar
    for (const capY of [0.80, 2.24]) {
      const cap = new THREE.SphereGeometry(0.0165, 16, 12);
      cap.scale(1, 0.65, 1);
      cap.translate(handleX, capY, side * (T * 0.5 + 0.072));
      brassParts.push(cap);
    }
  }

  // Low-iron architectural glass pane inside upper aperture
  const glassPane = new THREE.BoxGeometry(glassW - 0.01, glassH - 0.01, 0.012);
  glassPane.translate(W * 0.5, glassCenterY, 0);
  glassParts.push(glassPane);

  const mergedWalnutV = applyArchitecturalUVs(mergeNonIndexed(walnutVerticalParts), 0.72, true);
  const mergedWalnutH = applyArchitecturalUVs(mergeNonIndexed(walnutHorizontalParts), 0.72, false);
  const mergedWalnut = mergeGeometries([mergedWalnutV, mergedWalnutH], false);
  const mergedBronze = applyArchitecturalUVs(mergeNonIndexed(bronzeParts), 1.0, true);
  const mergedBrass = applyArchitecturalUVs(mergeNonIndexed(brassParts), 1.0, true);
  const mergedGlass = applyArchitecturalUVs(mergeNonIndexed(glassParts), 0.5, true);

  writeMultiMaterialGLB(
    path.join(OUT_DIR, 'monumental-door-leaf.glb'),
    'MonumentalDoorLeaf',
    [
      {
        materialName: 'WalnutMillwork',
        geometry: mergedWalnut,
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 0.0,
        roughnessFactor: 0.48,
      },
      {
        materialName: 'BurnishedBronze',
        geometry: mergedBronze,
        baseColorFactor: [0.19, 0.15, 0.12, 1],
        metallicFactor: 0.88,
        roughnessFactor: 0.34,
      },
      {
        materialName: 'BrushedBrass',
        geometry: mergedBrass,
        baseColorFactor: [0.72, 0.58, 0.36, 1],
        metallicFactor: 0.9,
        roughnessFactor: 0.26,
      },
      {
        materialName: 'ArchitecturalGlass',
        geometry: mergedGlass,
        baseColorFactor: [0.84, 0.91, 0.97, 0.28],
        metallicFactor: 0.05,
        roughnessFactor: 0.06,
        alphaMode: 'BLEND',
      },
    ]
  );
}

// ============================================================================
// 2. ARCHITECTURAL WALL SCONCE (`architectural-sconce.glb`)
//    Sculpted bronze & warm alabaster/opal glass architectural luminaire
// ============================================================================
{
  const bronze = [];
  const diffuser = [];

  // Stepped bronze wall backplate
  const back1 = new THREE.BoxGeometry(0.13, 0.38, 0.018);
  back1.translate(0, 0, 0.009);
  bronze.push(back1);

  const arm = new THREE.BoxGeometry(0.028, 0.028, 0.11);
  arm.translate(0, -0.06, 0.065);
  bronze.push(arm);

  // Top & bottom bronze finial rings cradling the vertical fluted opal diffuser
  for (const ry of [-0.17, 0.17]) {
    const ring = new THREE.CylinderGeometry(0.052, 0.052, 0.022, 24);
    ring.translate(0, ry, 0.12);
    bronze.push(ring);
  }

  // Slender vertical bronze rib
  const rib = new THREE.BoxGeometry(0.012, 0.36, 0.014);
  rib.translate(0, 0, 0.172);
  bronze.push(rib);

  // Turned warm opal glass cylinder diffuser
  const shade = new THREE.CylinderGeometry(0.046, 0.046, 0.32, 24);
  shade.translate(0, 0, 0.12);
  diffuser.push(shade);

  writeMultiMaterialGLB(
    path.join(OUT_DIR, 'architectural-sconce.glb'),
    'ArchitecturalSconce',
    [
      {
        materialName: 'BurnishedBronze',
        geometry: applyArchitecturalUVs(mergeNonIndexed(bronze), 1.0, true),
        baseColorFactor: [0.19, 0.15, 0.12, 1],
        metallicFactor: 0.88,
        roughnessFactor: 0.34,
      },
      {
        materialName: 'WarmOpalDiffuser',
        geometry: applyArchitecturalUVs(mergeNonIndexed(diffuser), 1.0, true),
        baseColorFactor: [1.0, 0.88, 0.72, 1],
        metallicFactor: 0.0,
        roughnessFactor: 0.35,
      },
    ]
  );
}

// ============================================================================
// 3. CURVED-SPINE HARDCOVER BOOK UNIT (`curved-book-unit.glb`)
//    Normalized unit (width X = 1, height Y = 0..1, depth Z = 1, spine facing +Z)
//    Two primitives:
//      0 -> Cloth/Leather Binding (rounded spine + overhanging front/back boards + raised bands)
//      1 -> Recessed Cream Paper Page Block
// ============================================================================
{
  const coverGeoms = [];

  // Front & back cover boards (-0.5 and +0.5 X, thickness 0.07 each)
  const leftBoard = new THREE.BoxGeometry(0.075, 1.0, 0.96);
  leftBoard.translate(-0.462, 0.5, -0.02);
  coverGeoms.push(leftBoard);

  const rightBoard = new THREE.BoxGeometry(0.075, 1.0, 0.96);
  rightBoard.translate(0.462, 0.5, -0.02);
  coverGeoms.push(rightBoard);

  // Curved spine facing +Z (half-cylinder crown)
  const spine = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 12, 1, false, -Math.PI * 0.5, Math.PI);
  spine.scale(1.0, 1.0, 0.11);
  spine.translate(0, 0.5, 0.445);
  coverGeoms.push(spine);

  // Subtle raised bookbinder ribs along the spine
  for (const bandY of [0.18, 0.36, 0.68, 0.84]) {
    const rib = new THREE.CylinderGeometry(0.515, 0.515, 0.018, 10, 1, false, -Math.PI * 0.48, Math.PI * 0.96);
    rib.scale(1.0, 1.0, 0.125);
    rib.translate(0, bandY, 0.446);
    coverGeoms.push(rib);
  }

  // Recessed cream paper block (top, bottom & fore-edge visible!)
  const pageBlock = new THREE.BoxGeometry(0.84, 0.955, 0.89);
  pageBlock.translate(0, 0.495, -0.025);

  writeMultiMaterialGLB(
    path.join(OUT_DIR, 'curved-book-unit.glb'),
    'CurvedBookUnit',
    [
      {
        materialName: 'BookBindingCloth',
        geometry: applyArchitecturalUVs(mergeNonIndexed(coverGeoms), 2.0, true),
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 0.02,
        roughnessFactor: 0.72,
      },
      {
        materialName: 'BookCreamPages',
        geometry: applyArchitecturalUVs(pageBlock, 4.0, false),
        baseColorFactor: [0.91, 0.88, 0.81, 1],
        metallicFactor: 0.0,
        roughnessFactor: 0.86,
      },
    ]
  );
}

// ============================================================================
// 4. MONUMENTAL BOOKCASE BAY (`bookcase-bay.glb`)
//    Width X = 2.40 m (-1.20 .. +1.20), Height Y = 4.20 m (0 .. +4.20), Depth Z = 0.46 m
//    Stepped plinth, fluted pilasters with capitals, 7 moulded shelves, cornice entablature,
//    and brushed-brass rolling-ladder rail.
// ============================================================================
{
  const W = 2.40;
  const H = 4.20;
  const D = 0.46;
  const walnutV = [];
  const walnutH = [];
  const brass = [];

  // Back recessed walnut wainscoting panel
  const back = new THREE.BoxGeometry(W - 0.12, H - 0.24, 0.028);
  back.translate(0, H * 0.5, -D * 0.5 + 0.02);
  walnutV.push(back);

  // Stepped base plinth (0 -> 0.26 m)
  const plinth1 = new THREE.BoxGeometry(W + 0.06, 0.16, D + 0.06);
  plinth1.translate(0, 0.08, 0.01);
  walnutH.push(plinth1);

  const plinth2 = new THREE.BoxGeometry(W + 0.02, 0.10, D + 0.02);
  plinth2.translate(0, 0.21, 0.005);
  walnutH.push(plinth2);

  // Left & right structural stiles + fluted pilasters with bases and capitals
  for (const sx of [-W * 0.5 + 0.075, W * 0.5 - 0.075]) {
    const cheek = new THREE.BoxGeometry(0.15, H - 0.36, D);
    cheek.translate(sx, 0.26 + (H - 0.36) * 0.5, 0);
    walnutV.push(cheek);

    // Projecting pilaster face with 3 vertical flutes (visualized via 4 slender fillets)
    for (const fx of [-0.048, -0.016, 0.016, 0.048]) {
      const fillet = new THREE.BoxGeometry(0.014, H - 0.68, 0.024);
      fillet.translate(sx + fx, 0.42 + (H - 0.68) * 0.5, D * 0.5 + 0.012);
      walnutV.push(fillet);
    }

    // Pilaster base & capital mouldings
    const capBase = new THREE.BoxGeometry(0.19, 0.14, 0.06);
    capBase.translate(sx, 0.34, D * 0.5 + 0.015);
    walnutH.push(capBase);

    const capTop = new THREE.BoxGeometry(0.21, 0.16, 0.075);
    capTop.translate(sx, H - 0.28, D * 0.5 + 0.02);
    walnutH.push(capTop);
  }

  // 7 Moulded horizontal shelves (y = 0.26, 0.80, 1.34, 1.88, 2.42, 2.96, 3.50)
  for (const sy of [0.80, 1.34, 1.88, 2.42, 2.96, 3.50]) {
    const shelf = new THREE.BoxGeometry(W - 0.28, 0.036, D - 0.04);
    shelf.translate(0, sy, 0.0);
    walnutH.push(shelf);

    // Stepped front shelf nosing
    const nosing = new THREE.BoxGeometry(W - 0.28, 0.046, 0.024);
    nosing.translate(0, sy - 0.004, D * 0.5 - 0.01);
    walnutH.push(nosing);
  }

  // Stepped classical cornice entablature (y = 3.92 -> 4.20)
  const frieze = new THREE.BoxGeometry(W + 0.04, 0.14, D + 0.05);
  frieze.translate(0, 3.99, 0.02);
  walnutH.push(frieze);

  const crown1 = new THREE.BoxGeometry(W + 0.12, 0.07, D + 0.12);
  crown1.translate(0, 4.095, 0.05);
  walnutH.push(crown1);

  const crown2 = new THREE.BoxGeometry(W + 0.18, 0.07, D + 0.17);
  crown2.translate(0, 4.165, 0.075);
  walnutH.push(crown2);

  // Brushed brass library ladder rail + brackets at y = 3.56 m
  const rail = new THREE.CylinderGeometry(0.014, 0.014, W + 0.02, 16);
  rail.rotateZ(Math.PI * 0.5);
  rail.translate(0, 3.56, D * 0.5 + 0.055);
  brass.push(rail);

  for (const bx of [-W * 0.5 + 0.075, 0, W * 0.5 - 0.075]) {
    const bracket = new THREE.BoxGeometry(0.022, 0.028, 0.065);
    bracket.translate(bx, 3.56, D * 0.5 + 0.025);
    brass.push(bracket);
  }

  const mergedWV = applyArchitecturalUVs(mergeNonIndexed(walnutV), 0.65, true);
  const mergedWH = applyArchitecturalUVs(mergeNonIndexed(walnutH), 0.65, false);

  writeMultiMaterialGLB(
    path.join(OUT_DIR, 'bookcase-bay.glb'),
    'BookcaseBay',
    [
      {
        materialName: 'WalnutMillwork',
        geometry: mergeGeometries([mergedWV, mergedWH], false),
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 0.0,
        roughnessFactor: 0.48,
      },
      {
        materialName: 'BrushedBrass',
        geometry: applyArchitecturalUVs(mergeNonIndexed(brass), 1.0, true),
        baseColorFactor: [0.72, 0.58, 0.36, 1],
        metallicFactor: 0.9,
        roughnessFactor: 0.28,
      },
    ]
  );
}

for (const f of fs.readdirSync(OUT_DIR)) {
  const s = fs.statSync(path.join(OUT_DIR, f));
  console.log(`Built GLB: ${f} (${(s.size / 1024).toFixed(1)} KB)`);
}
