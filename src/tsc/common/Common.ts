export const str = {
  totalTrim: (s: string) =>
    s !== undefined ? s.replace(/\s\s+/g, " ").trim() : "",
  equalsInvariant: (s1: string, s2: string) => {
    if (!s1 || !s2) {
      return s1 === s2;
    }

    return s1.toLowerCase() === s2.toLowerCase();
  },
  startsWith: (s1: string, s2: string) => s1.indexOf(s2) === 0,
};

export class Common {
  // Objects
  public static propsEach(obj: any, func: (key: string, value: any) => any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        func(key, value);
      }
    }
  }
}
