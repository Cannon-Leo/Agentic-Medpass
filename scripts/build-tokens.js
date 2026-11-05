/**
 * scripts/build-tokens.js
 *
 * Converts design-tokens.tokens.json into CSS variables following standard
 * design system token architecture:
 *
 * 1. Primitive Tier (--primitive-*):
 *    Raw color palettes and key colors. PRIVATE reference layer - DO NOT USE DIRECTLY IN UI.
 *
 * 2. Color Roles Tier (--color-*):
 *    Semantic roles (primary, surface, on-surface, error, etc.) mapped directly
 *    to primitive CSS variables. USE THESE DIRECTLY IN UI COMPONENTS.
 *
 * 3. Typography & Effects (--font-*, --typography-*, --shadow-*):
 *    Scales for typography styles and drop-shadow elevations.
 *
 * 4. Iconography:
 *    Source of truth for all icons is locked in as Lucide Icons (https://lucide.dev/icons/).
 *
 * Usage:
 *   node scripts/build-tokens.js
 *   node scripts/build-tokens.js --in ./design-tokens.tokens.json --out ./src/styles/tokens.css
 */

const fs = require('fs');
const path = require('path');

// Helper to convert any string to clean kebab-case
function toKebab(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Convert 8-digit hex (#rrggbbaa) to rgba() if alpha < 1
function formatColor(hex) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  const clean = hex.trim();
  if (clean.length === 9) {
    const r = parseInt(clean.slice(1, 3), 16);
    const g = parseInt(clean.slice(3, 5), 16);
    const b = parseInt(clean.slice(5, 7), 16);
    const a = (parseInt(clean.slice(7, 9), 16) / 255).toFixed(3);
    // If fully opaque, return clean 6-digit hex
    if (clean.slice(7, 9).toLowerCase() === 'ff') {
      return `#${clean.slice(1, 7)}`;
    }
    return `rgba(${r}, ${g}, ${b}, ${parseFloat(a)})`;
  }
  return clean;
}

// Resolve token path like "primitives.color palettes.primary.primary 4"
function resolveTokenByPath(refPath, root) {
  const clean = refPath.replace(/^\{|\}$/g, '').trim();
  const parts = clean.split('.');
  let current = root;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return null;
    current = current[part];
  }
  return current;
}

// Parse CLI args
function getArg(flag, defaultValue) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return defaultValue;
}

function buildTokens() {
  const defaultInPath = path.resolve(__dirname, '../design-tokens.tokens.json');
  const defaultOutPath = path.resolve(__dirname, '../src/styles/tokens.css');

  const inputPath = path.resolve(process.cwd(), getArg('--in', defaultInPath));
  const outputPath = path.resolve(process.cwd(), getArg('--out', defaultOutPath));

  if (!fs.existsSync(inputPath)) {
    console.error(`[Error] Design tokens file not found at: ${inputPath}`);
    process.exit(1);
  }

  console.log(`[Tokens] Reading design tokens from: ${inputPath}`);
  const tokens = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const cssLines = [];

  cssLines.push('/* ==========================================================================');
  cssLines.push('   AGENTIC MEDPASS DESIGN SYSTEM TOKENS');
  cssLines.push('   Generated automatically from: design-tokens.tokens.json');
  cssLines.push('   Iconography Source of Truth: Lucide Icons (https://lucide.dev/icons/)');
  cssLines.push('   ========================================================================== */');
  cssLines.push('');
  cssLines.push(':root {');

  // ==========================================
  // 1. PRIMITIVES (DO NOT USE IN UI DIRECTLY)
  // ==========================================
  cssLines.push('  /* ========================================================================');
  cssLines.push('     1. PRIMITIVES (Palette swatches & key colors)');
  cssLines.push('     CRITICAL: Do NOT use primitive variables directly in UI components.');
  cssLines.push('     Always use semantic Color Roles (--color-*) below.');
  cssLines.push('     ======================================================================== */');

  const primitiveMap = new Map();

  // 1a. Key colors
  if (tokens.primitives && tokens.primitives['key colors']) {
    cssLines.push('');
    cssLines.push('  /* Primitives - Key Colors */');
    for (const [keyName, tokenObj] of Object.entries(tokens.primitives['key colors'])) {
      const fullPath = `primitives.key colors.${keyName}`;
      const varName = `--primitive-key-colors-${toKebab(keyName)}`;
      const formattedColor = formatColor(tokenObj.value);
      primitiveMap.set(fullPath, varName);
      cssLines.push(`  ${varName}: ${formattedColor};`);
    }
  }

  // 1b. Color Palettes
  if (tokens.primitives && tokens.primitives['color palettes']) {
    for (const [paletteName, paletteItems] of Object.entries(tokens.primitives['color palettes'])) {
      cssLines.push('');
      cssLines.push(`  /* Primitives - Palette: ${paletteName} */`);
      for (const [shadeName, tokenObj] of Object.entries(paletteItems)) {
        const fullPath = `primitives.color palettes.${paletteName}.${shadeName}`;
        const varName = `--primitive-color-palettes-${toKebab(paletteName)}-${toKebab(shadeName)}`;
        const formattedColor = formatColor(tokenObj.value);
        primitiveMap.set(fullPath, varName);
        cssLines.push(`  ${varName}: ${formattedColor};`);
      }
    }
  }

  // ==========================================
  // 2. COLOR ROLES (SEMANTIC TOKENS - USE IN UI)
  // ==========================================
  cssLines.push('');
  cssLines.push('  /* ========================================================================');
  cssLines.push('     2. COLOR ROLES (Semantic UI tokens)');
  cssLines.push('     USE THESE DIRECTLY in UI components (buttons, surfaces, typography, borders).');
  cssLines.push('     ======================================================================== */');

  if (tokens['color roles']) {
    for (const [roleName, roleObj] of Object.entries(tokens['color roles'])) {
      const roleKebab = toKebab(roleName);
      const semanticVar = `--color-${roleKebab}`;
      const rawRef = (roleObj.value || '').trim();

      let cssValue = '';
      if (rawRef.startsWith('{') && rawRef.endsWith('}')) {
        const refPath = rawRef.slice(1, -1).trim();
        if (primitiveMap.has(refPath)) {
          // Direct reference to a primitive
          cssValue = `var(${primitiveMap.get(refPath)})`;
        } else if (refPath.startsWith('color roles.')) {
          // Reference to another color role
          const targetRoleName = refPath.replace('color roles.', '').trim();
          cssValue = `var(--color-${toKebab(targetRoleName)})`;
        } else {
          // Fallback resolution
          const resolved = resolveTokenByPath(refPath, tokens);
          if (resolved && resolved.value) {
            cssValue = formatColor(resolved.value);
          } else {
            cssValue = rawRef;
          }
        }
      } else {
        cssValue = formatColor(rawRef);
      }

      cssLines.push(`  ${semanticVar}: ${cssValue};`);
    }
  }

  // ==========================================
  // 3. TYPOGRAPHY
  // ==========================================
  cssLines.push('');
  cssLines.push('  /* ========================================================================');
  cssLines.push('     3. TYPOGRAPHY TOKENS');
  cssLines.push('     Font family, size, line-height, letter-spacing, and font-weight.');
  cssLines.push('     ======================================================================== */');
  cssLines.push("  --font-family-base: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;");

  const typographySource = tokens.typography || tokens.font;
  if (typographySource) {
    for (const [styleName, styleObj] of Object.entries(typographySource)) {
      const nameKebab = toKebab(styleName);
      // Support both structure formats (direct value object or typed value wrappers)
      const val = styleObj.value || styleObj;
      const fontSize = typeof val.fontSize === 'object' ? val.fontSize.value : val.fontSize;
      const lineHeight = typeof val.lineHeight === 'object' ? val.lineHeight.value : val.lineHeight;
      const fontWeight = typeof val.fontWeight === 'object' ? val.fontWeight.value : val.fontWeight;
      const letterSpacing = typeof val.letterSpacing === 'object' ? val.letterSpacing.value : val.letterSpacing;

      cssLines.push('');
      cssLines.push(`  /* Typography: ${styleName} */`);
      cssLines.push(`  --typography-${nameKebab}-size: ${fontSize}px;`);
      cssLines.push(`  --typography-${nameKebab}-line-height: ${lineHeight}px;`);
      cssLines.push(`  --typography-${nameKebab}-weight: ${fontWeight};`);
      cssLines.push(`  --typography-${nameKebab}-letter-spacing: ${letterSpacing}px;`);
      cssLines.push(`  --font-${nameKebab}: ${fontWeight} ${fontSize}px/${lineHeight}px var(--font-family-base);`);
    }
  }

  // ==========================================
  // 4. EFFECTS & ELEVATION (SHADOWS)
  // ==========================================
  cssLines.push('');
  cssLines.push('  /* ========================================================================');
  cssLines.push('     4. ELEVATION / SHADOW TOKENS');
  cssLines.push('     ======================================================================== */');

  if (tokens.effect) {
    for (const [effectName, effectObj] of Object.entries(tokens.effect)) {
      const nameKebab = toKebab(effectName);
      const val = effectObj.value || {};
      const x = val.offsetX !== undefined ? `${val.offsetX}px` : '0px';
      const y = val.offsetY !== undefined ? `${val.offsetY}px` : '0px';
      const radius = val.radius !== undefined ? `${val.radius}px` : '0px';
      const spread = val.spread !== undefined ? `${val.spread}px` : '0px';
      const color = formatColor(val.color || '#000000');

      cssLines.push(`  --shadow-${nameKebab}: ${x} ${y} ${radius} ${spread} ${color};`);
    }
  }

  cssLines.push('}');
  cssLines.push('');

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, cssLines.join('\n'), 'utf8');
  console.log(`[Tokens] CSS variables successfully generated at: ${outputPath}`);
}

buildTokens();

