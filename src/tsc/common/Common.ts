export const str = {
  equalsInvariant: (s1: string, s2: string) => {
    if (!s1 || !s2) {
      return s1 === s2;
    }

    return s1.toLowerCase() === s2.toLowerCase();
  }
};
