export const str = {
  totalTrim: (s: string) =>
    s !== undefined ? s.replace(/\s\s+/g, " ").trim() : "",
  equalsInvariant: (s1: string, s2: string) =>
    s1.toLowerCase() === s2.toLowerCase(),
  startsWith: (s1: string, s2: string) => s1.indexOf(s2) === 0,
};

export class Common {
  // Extend
  // from http://youmightnotneedjquery.com/
  public static extend(out: any, ...extensions: any[]) {
    out = out || {};

    for (let i = 1; i < extensions.length; i++) {
      if (!extensions[i]) {
        continue;
      }

      for (const key in extensions[i]) {
        if (extensions[i].hasOwnProperty(key)) {
          out[key] = extensions[i][key];
        }
      }
    }

    return out;
  }

  // Selection
  public static getSelectedText() {
    let text = "";
    const doc = document as any;
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (doc.selection && doc.selection.type !== "Control") {
      text = doc.selection.createRange().text;
    }
    return text;
  }

  // Objects
  public static propsEach(obj: any, func: (key: string, value) => any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        func(key, value);
      }
    }
  }

  public static propsFilterKeys(
    obj: any,
    filter: (key: string, value) => boolean,
    payload?
  ) {
    const result = [];
    Common.propsEach(obj, (key, value) => {
      if (filter(key, value)) {
        result.push(key);
      }
    });

    if (payload) {
      result.push(payload);
    }

    return result;
  }
}
