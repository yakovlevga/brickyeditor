// String extensions
interface String {
    breTotalTrim(): string;
    breEqualsInvariant(other: String): Boolean;
    breStartsWith(part: String) : Boolean;    
    breContains(part: String) : Boolean; 
}

String.prototype.breContains = function(part: String) : Boolean   {
    return this.indexOf(part) >= 0;
}

String.prototype.breStartsWith = function(part: String) : Boolean   {
    return this.indexOf(part) == 0;
}

String.prototype.breTotalTrim = function() : string {
    return this ? this.replace(/\s\s+/g, ' ').trim() : '';
}

String.prototype.breEqualsInvariant = function(other: String) {    
    return this.toLowerCase() === other.toLowerCase();
}

// Array extensions

interface Array<T> {
    first(filter: (elem: T) => Boolean) : T;
}

Array.prototype.first = function<T>(filter: (elem: T) => Boolean) {
    for(var i = 0; i < this.length; i++) {
        var elem = this[i]; 
        if(filter(this[i])) {
            return elem;
        }
    }
    return null;
}

// Object extensions

// interface Object {
//     breForEach(func: (key, value) => void);
//     breFilterKeys(filter: (key: string, value) => Boolean);
//     breFilterKeys(filter: (key: string, value) => Boolean, payload?);
// }

// Object.prototype.breForEach = function(func: (key, value) => void) {
//     if(typeof func !== "function")
//         return;
        
//     for (var key in this) {
//         if (this.hasOwnProperty(key)) {
//             var value = this[key];
//             func(key, value);    
//         }
//     }
// }

// Object.prototype.breFilterKeys = function(filter: (key, value) => Boolean) {
//     let result = [];
//     this.breForEach((key ,value) => {
//         if(filter(key ,value)) {
//             result.push(key);
//         }
//     });
//     return result;
// }

// Object.prototype.breFilterKeys = function(filter: (key, value) => Boolean, payload?) {
//     let result = this.breFilterKeys(filter);
//     if(payload) {
//         result.push(payload);
//     }
//     return result;
// }        

namespace BrickyEditor {
    export class Common {        

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


        // Arrays

        static arrayFilter(array, filter, payload?) {
            let result = [];
            
            Common.arrayEach(array, function(element) {
                if(filter(element)) {
                    result.push(element);
                }
            });

            if(payload) {
                result.push(payload);
            }

            return result;
        }

        static arrayFind(array, filter) : any {
            Common.arrayEach(array, function(element) {
                if(filter(element)) {
                    return element;
                }
            });         

            return null;
        }

        static arrayFindByField(array, fieldName, fieldValue) : any {
            Common.arrayEach(array, function(element) {
                if(element.hasOwnProperty(fieldName) && 
                   element[fieldName] === fieldValue) {
                    return element;
                }
            });
            
            return null;
        }

        static arrayMap(array, map) {
            let result = [];
            Common.arrayEach(array, function(element) {
                result.push(map(element));
            });
            return result;
        }

        static arrayAny(array, filter) : Boolean {
            var result = false;
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                if(filter(element)) {
                    result = true;
                    break;
                }   
            }
            return result;
        }

        static arrayEach(array, func) {
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                func(element);
            }
        }
    }    
}