import { Block } from "./Block/Block";

export class EditorOptions {
    /** Url to predifined templates */
    public templatesUrl: string = "templates/bootstrap4.html";

    /** OnLoad callback */
    public onload: any; // depricated callback
    public onLoad: any;

    /** OnError callback */
    public onError: any = (data: any) => {
        console.log(data.message);
    }

    /** OnChange callback */
    public onChange: any;
    /** onBlockAdd callback */
    public onBlockAdd: any;
    /** onBlockDelete callback */
    public onBlockDelete: any;
    /** onBlockMove callback */
    public onBlockMove: any;
    /** onBlockSelect callback */
    public onBlockSelect: any;
    /** onBlockDeselect callback */
    public onBlockDeselect: any;
    /** onBlockUpdate callback */
    public onBlockUpdate: any;

    public onUpload: (file: any, callback: (url: string) => void) => void;

    /** Url to fetch initial blocks, overrides initial blocks property */
    public blocksUrl: string;
    /** Inital block data */
    public blocks: Array<Block>;
    /** Show blocks selector in compact mode */
    public compactTools?: Boolean = null;
    /** Max screen width to show tools in compact mode */
    public compactToolsWidth: number = 768;
    /** Ignore blocks html field, if you need only json */
    public ignoreHtml?: Boolean = null;
    /** Custom Html editor buttons */
    public htmlToolsButtons?: Array<HtmlToolsButton> = null;
    /** Form selector to bind form submit event */
    public formSelector: string;
    /** Input selector to put json to on form submit */
    public inputSelector: string;

    constructor(options: EditorOptions) {
        this.templatesUrl = options.templatesUrl || this.templatesUrl;

        this.onLoad = options.onLoad || options.onload;
        this.onChange = options.onChange;
        this.onBlockAdd = options.onBlockAdd;
        this.onBlockDelete = options.onBlockDelete;
        this.onBlockMove = options.onBlockMove;
        this.onBlockSelect = options.onBlockSelect;
        this.onBlockDeselect = options.onBlockDeselect;
        this.onBlockUpdate = options.onBlockUpdate;
        this.onError = options.onError || this.onError;
        this.onUpload = options.onUpload || null;

        this.blocksUrl = options.blocksUrl || null;
        this.blocks = options.blocks || null;
        this.compactTools = options.compactTools;
        this.ignoreHtml = options.ignoreHtml || false;
        this.htmlToolsButtons = options.htmlToolsButtons || null;

        this.formSelector = options.formSelector || null;
        this.inputSelector = options.inputSelector || null;
    }
}