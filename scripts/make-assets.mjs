// Gera as imagens do site a partir de capturas reais do app (emulador Android, tema claro).
//   node scripts/make-assets.mjs
// Entrada: .shots/<nome>.png (1080×2400, não versionadas). Saída: img/screens/<nome>[@2x|@3x].webp,
// img/og.png e img/apple-touch-icon.png.
//
// As capturas vêm do Expo Go, que desenha um botão de engrenagem no canto superior direito.
// O script o cobre com a cor de fundo da tela e recorta a barra de status e a de gestos.
import { mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = join(root, '.shots');
const out = join(root, 'img', 'screens');
await mkdir(out, { recursive: true });

const CROP = { left: 0, top: 80, width: 1080, height: 2230 };
const GEAR = { left: 890, top: 30, width: 190, height: 152 };
const WIDTHS = [
  ['', 296],
  ['@2x', 592],
  ['@3x', 888],
];

async function backgroundAt(image, x, y) {
  const { data } = await image
    .clone()
    .extract({ left: x, top: y, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2], alpha: 1 };
}

for (const file of (await readdir(shots)).filter((name) => name.endsWith('.png'))) {
  const name = file.replace('.png', '');
  const source = sharp(join(shots, file));
  const background = await backgroundAt(source, 500, 10);

  const layers = [
    {
      input: {
        create: { width: GEAR.width, height: GEAR.height, channels: 4, background },
      },
      left: GEAR.left,
      top: GEAR.top,
    },
  ];

  if (name === 'importar') {
    // Esconde o botão "Simular arquivo (dev)", que só existe em build de desenvolvimento.
    layers.push({
      input: { create: { width: 780, height: 110, channels: 4, background } },
      left: 150,
      top: 1850,
    });
  }

  if (name === 'agenda') {
    // O botão "próximo mês" fica sob a engrenagem: refaz o topo dele copiando o do botão "anterior".
    const piece = await source
      .clone()
      .extract({ left: 775, top: 140, width: 115, height: 39 })
      .png()
      .toBuffer();
    layers.push({ input: piece, left: 775 + 137, top: 140 });
  }

  const cleaned = await sharp(await source.composite(layers).png().toBuffer())
    .extract(CROP)
    .toBuffer();

  for (const [suffix, width] of WIDTHS) {
    await sharp(cleaned)
      .resize({ width })
      .webp({ quality: 84 })
      .toFile(join(out, `${name}${suffix}.webp`));
  }
  console.log(`✓ ${name}`);
}

// Ícone do app (iOS) e imagem de compartilhamento.
const symbol = (color) =>
  `<g fill="none" stroke="${color}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"><path d="M24 36 50 78 76 36"/></g><circle cx="50" cy="24" r="8.5" fill="${color}"/>`;

await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 100 100"><rect width="100" height="100" fill="#2E63F0"/><g transform="translate(15 15) scale(.7)">${symbol('#fff')}</g></svg>`,
  ),
)
  .png()
  .toFile(join(root, 'img', 'apple-touch-icon.png'));

const font = 'Segoe UI, Helvetica, Arial, sans-serif';
await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#F5F5F7"/>
<rect x="80" y="80" width="96" height="96" rx="21.6" fill="#2E63F0"/>
<g transform="translate(96 96) scale(.64)">${symbol('#fff')}</g>
<text x="196" y="146" font-family="${font}" font-size="56" font-weight="600" letter-spacing="-2.5" fill="#111114">veterano</text>
<text x="80" y="340" font-family="${font}" font-size="104" font-weight="700" letter-spacing="-4.5" fill="#111114">Seu veterano</text>
<text x="80" y="450" font-family="${font}" font-size="104" font-weight="700" letter-spacing="-4.5" fill="#111114">no bolso.</text>
<text x="80" y="540" font-family="${font}" font-size="32" fill="#5D5D66">Provas, notas e quantas faltas ainda dá. Funciona sem internet.</text>
</svg>`),
)
  .png()
  .toFile(join(root, 'img', 'og.png'));
console.log('✓ apple-touch-icon e og');
