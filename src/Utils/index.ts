export const byteToHexString = (uint8arr: null | Uint8Array) => {
  if (!uint8arr) {
    return "";
  }

  let hexStr = "";
  for (var i = 0; i < uint8arr.length; i++) {
    let hex = (uint8arr[i] & 0xff).toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
};

export const hexToBytes = (hex: string | undefined): Array<number> => {
  if (!hex) return [];

  const strArray = hex.split(/(..)/g).filter((s) => s);
  const idBytes: Array<number> = strArray.map((val) => parseInt(val, 16));

  return idBytes;
};

export const arraycopy = (
  src: Array<any> | Uint8Array,
  srcPos: number,
  dst: Array<any> | Uint8Array,
  dstPos: number,
  length: number
) => {
  src.slice(srcPos, srcPos + length).forEach((e, i) => (dst[dstPos + i] = e));
};
