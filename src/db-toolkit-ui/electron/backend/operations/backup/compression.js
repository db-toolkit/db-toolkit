/**
 * File compression utilities.
 */

const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

async function compressFile(filePath) {
  const source = fs.createReadStream(filePath);
  const destination = fs.createWriteStream(`${filePath}.gz`);
  const gzip = zlib.createGzip();
  
  await pipeline(source, gzip, destination);
  await fs.promises.unlink(filePath);
}

async function decompressFile(compressedPath, outputPath) {
  const source = fs.createReadStream(compressedPath);
  const destination = fs.createWriteStream(outputPath);
  const gunzip = zlib.createGunzip();
  
  await pipeline(source, gunzip, destination);
}

module.exports = { compressFile, decompressFile };
