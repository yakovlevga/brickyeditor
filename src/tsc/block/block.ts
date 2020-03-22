import { toggleFieldSelection } from "@/fields/field";
import { getTemplate } from "@/template";
import { bre } from "@/types/bre";
import { showBlockEditor, hideBlockEditor } from "@/block/blockEditor";
import { emitter } from "@/emitter";
import { bindBlockFields } from "@/fields/fields";
import { helpers } from "@/helpers";
import { isContainerField } from "@/fields/container";

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

  const parentBlocks = getParentBlocks(block);

  if (selected) {
    showBlockEditor(block, false);
    parentBlocks.forEach(parent => showBlockEditor(parent, true));
  } else {
    hideBlockEditor(block);
    parentBlocks.forEach(parent => hideBlockEditor(parent));
  }
};

export const createBlockFromData = (
  parentContainer: bre.BlocksContainer,
  blockData: bre.block.BlockData
): bre.block.Block => {
  const { name, $template } = getTemplate(blockData.template);
  return createBlockFromTemplate(parentContainer, name, $template, blockData);
};

export const createBlockFromTemplate = (
  parentContainer: bre.BlocksContainer,
  name: string,
  $template: HTMLElement,
  data: bre.block.BlockData = {
    template: name,
    fields: []
  }
): bre.block.Block => {
  const $element = $template.cloneNode(true) as HTMLElement;
  helpers.toggleClassName($element, "bre-template", false);
  helpers.toggleClassName($element, "bre-block", true);

  const eventEmitter = emitter<bre.block.BlockEventMap>();
  const block: bre.block.Block = {
    ...eventEmitter,
    $element,
    data,
    selectedField: null,
    parentContainer
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

function getParentBlocks(block: bre.block.Block): bre.block.Block[] {
  const parentBlocks: bre.block.Block[] = [];

  let { parentContainerField } = block.parentContainer;
  while (
    parentContainerField !== null &&
    parentContainerField.parentBlock !== null
  ) {
    const { parentBlock } = parentContainerField;
    parentBlocks.push(parentBlock);
    parentContainerField = parentBlock.parentContainer.parentContainerField;
  }

  return parentBlocks;
}
