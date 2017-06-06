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