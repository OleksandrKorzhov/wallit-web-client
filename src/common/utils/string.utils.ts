export const normalize = (value: any): string => String(value).trim().toLowerCase();

export const equals = (a: any, b: any): boolean => normalize(a) === normalize(b);

export const includes = (source: string, subPart: string): boolean => normalize(source).includes(normalize(subPart));
