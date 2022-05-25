export const decimalToHex = (d: number) =>
  Number(d).toString(16).padStart(2, "0");

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
