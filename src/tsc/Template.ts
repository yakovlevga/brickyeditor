// { 
//     "file": "containers/4columns", 
//     "title": "Three columns text"
// }

namespace BrickyEditor {
    export class Template {
        public file: string;
        public title: string;
        public category: string[];
        public html: string;

        constructor(data: any) {
            this.title = data.title;
            this.file = data.file;
            this.category = data.cactegory || [];
        }
    }
}