declare global {
  // String extensions
  interface String {
    breTotalTrim(): string;
    breEqualsInvariant(other: string): boolean;
    breStartsWith(part: string): boolean;
    breContains(part: string): boolean;
  }

  // Array extensions
  interface Array<T> {
    find(predicate: (search: T) => boolean): T;
  }

  interface IHtmlToolsButton {
    icon: string;
    command: string;
    range: boolean;
    aValueArgument: string;
  }
}

String.prototype.breContains = function(part: string): boolean {
  return this.indexOf(part) >= 0;
};

String.prototype.breStartsWith = function(part: string): boolean {
  return this.indexOf(part) === 0;
};

String.prototype.breTotalTrim = function(): string {
  return this ? this.replace(/\s\s+/g, " ").trim() : "";
};

String.prototype.breEqualsInvariant = function(other: string): boolean {
  return this.toLowerCase() === other.toLowerCase();
};

// Array extensions
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError("Array.prototype.find called on null or undefined");
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }
    const list = Object(this);
    // tslint:disable-next-line:no-bitwise
    const length = list.length >>> 0;
    const thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

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
