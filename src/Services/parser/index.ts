export const obtainTimestamp = (firstByte: number, secondByte: number) => {
  return bin2int(firstByte, secondByte);
};

const bin2int = (a: number, b: number): number =>
  (byte2uns(a) << 8) | byte2uns(b);

const byte2uns = (value: number) => (value + 256) % 256;
