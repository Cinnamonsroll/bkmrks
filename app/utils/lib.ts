export type ContentType =
  | "color"
  | "link"
  | "location"
  | "phone"
  | "number"
  | "text";

type PatternType = { type: ContentType; subtype?: string; pattern: RegExp };

export const getRandomColor = () => {
  const randomChannel = () => Math.floor(150 + Math.random() * 100);
  return `rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`;
};

export const generateGradient = (input: string) => {
  const FNV_prime = 16777619;
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash *= FNV_prime;
    hash >>>= 0;
  }
  const color1 = `hsl(${(hash & 0xff) * 1.41}, 70%, 60%)`;
  const color2 = `hsl(${((hash >> 8) & 0xff) * 1.41}, 70%, 60%)`;
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

export function detectContentType(input: string): {
  type: ContentType;
  subtype?: string;
} {
  const patterns: PatternType[] = [
    {
      type: "color",
      subtype: "hex",
      pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    },
    {
      type: "color",
      subtype: "rgb",
      pattern: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
    },
    {
      type: "color",
      subtype: "rgba",
      pattern:
        /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/,
    },
    {
      type: "color",
      subtype: "hsl",
      pattern: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/,
    },
    {
      type: "link",
      pattern: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
    },
    {
      type: "location",
      pattern:
        /^\d+\s+[A-Za-z0-9\s]+(?:Street|Avenue|Boulevard|Road|Way|Lane|Drive|Court|Place|Square|Plaza|Rd|Ave|St|Blvd|Ln|Dr|Ct|Sq)\.?$/i,
    },
    {
      type: "phone",
      pattern: /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
    },
    { type: "number", pattern: /^-?\d+(\.\d+)?$/ },
  ];

  for (const { type, subtype, pattern } of patterns) {
    if (pattern.test(input)) {
      return subtype ? { type, subtype } : { type };
    }
  }

  return { type: "text" };
}
