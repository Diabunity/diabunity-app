const hexToInt = (hex: string): number => {
  if (hex.length % 2 != 0) {
    hex = "0" + hex;
  }
  var num = parseInt(hex, 16);
  var maxVal = Math.pow(2, (hex.length / 2) * 8);
  if (num > maxVal / 2 - 1) {
    num = num - maxVal;
  }
  return num;
};

export const hexToBytes = (hex?: string): Array<number> => {
  if (!hex) return [];
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(hexToInt(hex.substr(c, 2)));
  return bytes;
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
