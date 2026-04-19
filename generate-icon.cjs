const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const outputDir = path.join(__dirname, 'public');

async function convert() {
  const svgBuffer = fs.readFileSync(svgPath);

  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile(path.join(outputDir, 'icon.png'));

  console.log('PNG created');

  const pngBuffer = fs.readFileSync(path.join(outputDir, 'icon.png'));
  const icoBuffer = await pngToIco.default(pngBuffer);
  fs.writeFileSync(path.join(outputDir, 'icon.ico'), icoBuffer);

  console.log('ICO created');
}

convert().catch(console.error);
