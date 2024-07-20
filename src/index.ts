import tinyColor from 'tinycolor2';

const ENTROPY = 123; // Raise numbers to prevent collisions in lower indexes

const int2HexColor = (num : number) => `#${Math.min(num, Math.pow(2, 24)).toString(16).padStart(6, '0')}`;
const rgb2Int = (r : number, g: number, b: number) => (r << 16) + (g << 8) + b;

const colorStr2Int = str => {
  const { r, g, b } = tinyColor(str).toRgb();
  return rgb2Int(r, g, b);
};

const checksum = (n : number, csBits : number) => (n * ENTROPY) % Math.pow(2, csBits);

export default class ColorTracker {
  csBits : number
  registry : any[]

  constructor(csBits : number = 6) {
    this.csBits = csBits; // How many bits to reserve for checksum. Will eat away into the usable size of the registry.
    this.registry = ['__reserved for background__']; // indexed objects for rgb lookup;
  }

  register(obj : any) {
    if (this.registry.length >= Math.pow(2, 24 - this.csBits)) { // color has 24 bits (-checksum)
      return null; // Registry is full
    }

    const idx = this.registry.length;
    const cs = checksum(idx, this.csBits);

    const color = int2HexColor(idx + (cs << (24 - this.csBits)));

    this.registry.push(obj);
    return color;
  }

  lookup(color: string | [number, number, number]) : any | null {
    const n = typeof color === 'string' ? colorStr2Int(color) : rgb2Int(...color);

    if (!n) return null; // 0 index is reserved for background

    const idx = n & (Math.pow(2, 24 - this.csBits) - 1); // registry index
    const cs = (n >> (24 - this.csBits)) & (Math.pow(2, this.csBits) - 1); // extract bits reserved for checksum

    if (checksum(idx, this.csBits) !== cs || idx >= this.registry.length) return null; // failed checksum or registry out of bounds

    return this.registry[idx];
  }
}
