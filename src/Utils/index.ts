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

export const hexStringToByte = (str: string | undefined) => {
  if (!str) {
    return new Uint8Array();
  }

  const a = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(a);
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
