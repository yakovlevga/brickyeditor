import { toggleFieldSelection } from "@/fields/field";
import { getTemplate } from "@/template";
import { bre } from "@/types/bre";
import { showBlockEditor, hideBlockEditor } from "@/block/blockEditor";
import { emitter } from "@/emitter";
import { bindBlockFields } from "@/fields/fields";
import { helpers } from "@/helpers";

export const selectField = (
  block: bre.block.Block,
  field: bre.field.FieldBase
) => {
  block.selectedField = field;
  block.fire("select", { block });
};

export const toggleBlockSelection = (
  block: bre.block.Block,
  selected: boolean
) => {
  if (!selected && block.selectedField !== null) {
    toggleFieldSelection(block.selectedField, false);
  }

  helpers.toggleClassName(block.$element, "bre-block-selected", selected);

  if (selected) {
    showBlockEditor(block);
  } else {
    hideBlockEditor();
  }
};

export const createBlockFromData = (
  blockData: bre.block.BlockData
): bre.block.Block => {
  const { name, $template } = getTemplate(blockData.template);
  return createBlockFromTemplate(name, $template, blockData);
};

export const createBlockFromTemplate = (
  name: string,
  $template: HTMLElement,
  data: bre.block.BlockData = {
    template: name,
    fields: []
  }
): bre.block.Block => {
  const $element = $template.cloneNode(true) as HTMLElement;

  const eventEmitter = emitter<bre.block.BlockEventMap>();
  const block: bre.block.Block = {
    ...eventEmitter,
    $element,
    data,
    selectedField: null
  };

  block.fields = bindBlockFields($element, block);
  block.fields.forEach(field => {
    if (field.on !== undefined) {
      field.on("select", f => {
        if (f !== undefined) {
          selectField(block, f.field);
        }
      });
    }
  });

  return block;
};

// TODO:
export const getBlockHtml = (block: bre.block.Block, trim: boolean = true) => {
  return "";

  // let $html = this.template.$html.clone(false, false)
  // .wrap('<div></div>')
  // .parent();

  // let fieldsHtml = {};
  // this.fields.forEach(field => {
  //   const name = field.name || field.data.name;
  //   fieldsHtml[name] = field.getEl();
  // });

  // $html
  //   .find(Selectors.selectorField)
  //   .addBack(Selectors.selectorField)
  //   .each((idx, elem) => {
  //       let fieldData = $(elem).data().breField;
  //       if(typeof fieldData === 'string') {
  //           fieldData = JSON.parse(fieldData.replace(/'/g, '"'));
  //       }
  //       const name = fieldData.name;
  //       const $field = fieldsHtml[name];
  //       $(elem).replaceWith($field);
  //   });

  // const html = $html.html();
  // if(!html) {
  //   return null;
  // }

  // return trim ? html.breTotalTrim() : html;
};
