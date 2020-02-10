import { bindFields, toggleFieldSelection } from "src/fields/field";
import { getTemplate } from "src/template";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";
import { showBlockEditor, hideBlockEditor } from "src/block/blockEditor";
import { emmiter, BlockEventMap } from "src/emmiter";

export const selectField = (
  block: bre.core.block.Block,
  field: bre.ui.FieldBase
) => {
  block.selectedField = field;
};

export const toggleBlockSelection = (
  container: bre.core.IBlocksContainer,
  block: bre.core.block.Block,
  selected: boolean
) => {
  if (!selected && block.selectedField !== null) {
    toggleFieldSelection(block.selectedField, false);
  }

  const { classList } = block.$element;
  if (selected) {
    classList.add(Selectors.selectorBlockSelected);
  } else {
    classList.remove(Selectors.selectorBlockSelected);
  }

  if (selected) {
    showBlockEditor(block);
  } else {
    hideBlockEditor();
  }
};

export const createBlockFromData = (
  blockData: bre.core.block.BlockData
): bre.core.block.Block => {
  const blockTemplate = getTemplate(blockData.template);
  return createBlockFromTemplate(blockTemplate, blockData);
};

export const createBlockFromTemplate = (
  blockTemplate: bre.core.ITemplate,
  data: bre.core.block.BlockData = {
    template: blockTemplate.name,
    fields: []
  }
): bre.core.block.Block => {
  const $element = blockTemplate.$html.cloneNode(true) as HTMLElement;

  const ee = emmiter<BlockEventMap>();
  const block: bre.core.block.Block = {
    ...ee,
    $element,
    data,
    selectedField: null
  };

  block.fields = bindFields($element, block);
  block.fields.forEach(field => {
    if (field.on !== undefined) {
      field.on("focus", f => {
        if (f !== undefined) {
          selectField(block, f.field);
        }
      });
    }
  });

  return block;
};

// return block;

// TODO: pass field events
// $fields.forEach($element => {
//   // const onUpdate = (property: string, oldValue: any, newValue: any) => {
//   //   if (block.events!.onUpdate !== undefined) {
//   //     block.events!.onUpdate(block, property, oldValue, newValue);
//   //   }
//   // };

//   // const onSelect = block.select;

//   const field = createField({
//     $element,
//     data,
//     onSelect,
//     // onUpdate,
//     // block.events ? block.events.onUpload : undefined
//   });

//   block.fields.push(field);
// });
// };

// export const createBlock = (
//   template: bre.core.ITemplate,
//   isPreview: boolean,
//   data?: bre.core.field.Field[]
// ): bre.core.block.Block => {
//   const result = {};

//   // this.template = template;
//   // this.html = html;
//   // this.events = events;

//   // const $block = helpers.createElement(html);
//   // this.bindFields($block, data);
//   // const actions = this.getActions();

//   // Build block UI
//   this.ui = new BlockUI($block, preview, actions, () => this.select());

//   return result;
//   //new Block(template.name, template.$html.innerHTML, isPreview, data, events);
// };

// export class Block {
//   public template: string;
//   public html: string;
//   public fields: bre.core.field.Field[] = [];
//   public ui: BlockUI;
//   public selectedField?: bre.core.field.Field | null;
//   public events?: bre.core.block.BlockEvents;

//   constructor(
//     template: string,
//     html: string,
//     preview: boolean,
//     data?: bre.core.field.Field[],
//     events?: bre.core.block.BlockEvents
//   ) {
//     this.template = template;
//     this.html = html;
//     this.events = events;

//     const $block = helpers.createElement(html);
//     this.bindFields($block, data);
//     const actions = this.getActions();

//     // Build block UI
//     this.ui = new BlockUI($block, preview, actions, () => this.select());
//   }

//   public isContainer(): boolean {
//     if (!this.selectedField) {
//       return false;
//     }

//     return this.selectedField.type === "container";
//   }

//   public delete() {
//     this.ui.delete();
//     this.events!.onDelete!(this);
//   }

//   public move(offset: number) {
//     this.events!.onMove!(this, offset);
//   }

//   public clone() {
//     this.events!.onCopy!(this);
//   }

//   public select(field?: bre.core.field.Field): void {
//     if (field === this.selectedField) {
//       return;
//     }

//     if (field === null) {
//       field = this.fields[0];
//     }

//     if (this.selectedField) {
//       toggleFieldSelection(this.selectedField, false);
//     }

//     this.selectedField = field;
//     this.ui.toggleSelection(true);
//     this.events!.onSelect!(this);
//   }

//   public deselect() {
//     this.selectedField = null;
//     this.fields.forEach(f => {
//       toggleFieldSelection(f, false);
//     });
//     this.ui.toggleSelection(false);
//     this.events!.onDeselect!(this);
//   }

//   public scrollTo() {
//     // todo: move to block ui
//     let top = $dom.offset(this.ui.$editor!).top - 100; // todo: move this magic number away
//     top = top > 0 ? top : 0;
//   }

//   public getData(ignoreHtml?: boolean): bre.core.block.BlockData {
//     // const fieldsData: bre.core.field.FieldData[] = [];

//     const fields = this.fields.map(({ name, type, data }) => ({
//       name,
//       type,
//       data,
//     }));

//     const blockData: bre.core.block.BlockData = {
//       template: this.template,
//       fields,
//     };

//     if (!ignoreHtml) {
//       blockData.html = this.getHtml(true);
//     }

//     return blockData;
//   }

//   public getHtml(trim: boolean): string {
//     const $html = helpers.createElement(this.html);
//     const fieldsHtml: {
//       [TKey: string]: HTMLElement;
//     } = {};

//     this.fields.forEach(field => {
//       if (field !== undefined) {
//         const name: string = field.name || field.data.name;
//         fieldsHtml[name] = field.getElement(field);
//       }
//     });

//     $dom.select($html, Selectors.selectorField, true).forEach($elem => {
//       const fieldData = helpers.parseElementData<any>($elem, "breField");
//       const name = fieldData.name;
//       const $field = fieldsHtml[name];
//       $dom.replaceWith($elem, $field);
//     });

//     const html = $html.outerHTML;
//     if (!html) {
//       return null;
//     }

//     return trim ? str.totalTrim(html) : html;
//   }

//   /**
//    * Finds and binds block fields
//    *
//    * @param data Array of block fields data
//    */
//   private bindFields($block: HTMLElement, data?: bre.core.field.Data[]) {
//     const block = this;
//     const $fields = $dom.select($block, Selectors.selectorField, true);
//     $fields.forEach($element => {
//       const onUpdate = (property: string, oldValue: any, newValue: any) => {
//         if (block.events!.onUpdate !== undefined) {
//           block.events!.onUpdate(block, property, oldValue, newValue);
//         }
//       };

//       const onSelect = block.select;

//       const field = createField({
//         $element,
//         fields: data,
//         onSelect,
//         // onUpdate,
//         // block.events ? block.events.onUpload : undefined
//       });
//       block.fields.push(field);
//     });
//   }

//   private getActions(): BlockUIAction[] {
//     const block = this;
//     const actions = [
//       new BlockUIAction("ellipsis-h"),
//       new BlockUIAction("trash-o", () => block.delete()),
//       new BlockUIAction("copy", () => block.clone()),
//       new BlockUIAction("angle-up", () => block.move(-1)),
//       new BlockUIAction("angle-down", () => block.move(1)),
//     ];
//     return actions;
//   }
// }
