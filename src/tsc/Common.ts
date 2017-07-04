// String extensions
interface String {
    breTotalTrim(): string;
    breEqualsInvariant(other: String): boolean;
    breStartsWith(part: String) : boolean;    
    breContains(part: String) : boolean; 
}

// Array extensions
interface Array<T> {
    find(predicate: (search: T) => boolean): T;
}

String.prototype.breContains = function(part: String) : boolean   {
    return this.indexOf(part) >= 0;
}

String.prototype.breStartsWith = function(part: String) : boolean   {
    return this.indexOf(part) == 0;
}

String.prototype.breTotalTrim = function() : string {
    return this ? this.replace(/\s\s+/g, ' ').trim() : '';
}

String.prototype.breEqualsInvariant = function(other: String) : boolean {    
    return this.toLowerCase() === other.toLowerCase();
}

// Array extensions
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

namespace BrickyEditor {
    export class Common {        

        // Selection
        static getSelectedText() {
            let text = "";
            let doc = document as any; 
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (doc.selection && doc.selection.type != "Control") {
                text = doc.selection.createRange().text;
            }
            return text;
        }

        // Objects
        static propsEach(obj: any, func: (key: string, value) => any) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    func(key, value);    
                }
            }
        }

        static propsFilterKeys(obj: any, filter: (key: string, value) => Boolean, payload?) {
            let result = [];
            Common.propsEach(obj, (key, value) => {
                if(filter(key ,value)) {
                    result.push(key);
                }
            });

            if(payload) {
                result.push(payload);
            }

            return result;
        }
    }    
}