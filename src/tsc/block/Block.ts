import { BlockUI, getBlockUI as getBlockElement } from "src/block/BlockUI";
import { BlockUIAction } from "src/block/BlockUIAction";
import { addBlockToContainer } from "src/BlocksContainer";
import { str } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import { createField, toggleFieldSelection } from "src/fields/field";
import { helpers } from "src/helpers";
import { getTemplate } from "src/template";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";

const findFields = ($html: HTMLElement) => {
  const nodes = $html.querySelectorAll(Selectors.selectorField);
  let $fields = nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];

  if ($html.attributes.getNamedItem(Selectors.attrField) !== null) {
    $fields = [...$fields, $html];
  }

  return $fields;
};

const deleteBlockFromContainer = (
  container: bre.core.IBlocksContainer,
  block: bre.core.block.Block
) => {
  container.blocks = container.blocks.filter(b => b !== block);
  block.$element.remove();
  (block as any) = null;
};

const cloneBlockInContainer = (
  container: bre.core.IBlocksContainer,
  block: bre.core.block.Block
) => {
  const idx = container.blocks.indexOf(block) + 1;
  addBlockToContainer(container, block.data, idx, true);
};

const moveBlockInContainer = (
  container: bre.core.IBlocksContainer,
  block: bre.core.block.Block,
  offset: number
) => {
  const { blocks } = container;
  const idx = blocks.indexOf(block);
  const new_idx = idx + offset;

  if (new_idx >= blocks.length || new_idx < 0) {
    return;
  }

  const $anchorBlock = blocks[new_idx].$element;
  if ($anchorBlock) {
    if (offset > 0) {
      $dom.after($anchorBlock, block.$element);
    } else if (offset < 0) {
      $dom.before($anchorBlock, block.$element);
    }
  }

  this.blocks.splice(idx, 1);
  this.blocks.splice(new_idx, 0, block);

  this.onMoveBlock(block, idx, new_idx);

  // Scroll to block
  block.scrollTo();
};

export const bindFields = (
  $element: HTMLElement,
  preview: boolean,
  fields: bre.core.field.FieldData[] = []
) => {
  const $fields = findFields($element);
  $fields.forEach($field =>
    createField({
      $element: $field,
      fields,
      preview,
    })
  );
};

export const createBlockFromData = (
  blockData: bre.core.block.BlockData
): bre.core.block.Block => {
  const { template, fields } = blockData;
  const blockTemplate = getTemplate(template);
  return createBlockFromTemplate(blockTemplate, fields);
};

export const createBlockFromTemplate = (
  blockTemplate: bre.core.ITemplate,
  fields: bre.core.field.FieldData[] = []
): bre.core.block.Block => {
  const $element = blockTemplate.$html.cloneNode(true) as HTMLElement;
  bindFields($element, false, fields);

  return {
    $element,
    data: {
      template: blockTemplate.name,
      fields,
    },
    selectedField: null,
  };
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
