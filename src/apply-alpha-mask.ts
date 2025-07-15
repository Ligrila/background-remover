/**
 * Merges an alpha mask with existing RGBA image data.
 * This function updates the alpha (transparency) channel of the original
 * pixel data using values from the provided alpha mask.
 *
 * @param originalPixels - The RGBA pixel data of the source image.
 * @param alphaMaskData - The pixel data from the segmentation mask, representing new alpha values.
 * @returns A new Uint8ClampedArray with the original RGB values and updated alpha values.
 */
export function applyAlphaMask(
  originalPixels: Uint8Array | Uint8ClampedArray,
  alphaMaskData: Uint8Array | Uint8ClampedArray
): Uint8Array | Uint8ClampedArray {
  const resultPixels = originalPixels.slice();
  for (let i = 0; i < alphaMaskData.length; ++i) {
    const alphaValue = alphaMaskData[i];
    if (typeof alphaValue === 'number') {
      resultPixels[i * 4 + 3] = alphaValue;
    } else {
      throw new Error('Unexpected error: Corrupted alpha mask data');
    }
  }
  return resultPixels;
}
