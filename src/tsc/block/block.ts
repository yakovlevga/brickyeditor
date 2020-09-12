import { getTemplate } from '@/template';
import { bre } from '@/types/bre';
import { showBlockEditor, hideBlockEditor } from '@/block/blockEditor';
import { bindBlockFields } from '@/fields/fields';
import { helpers } from '@/helpers';

export const toggleBlockSelection = (
  block: bre.block.Block,
  selected: boolean,
  active: boolean = false
) => {
  block.selected = selected;
  helpers.toggleClassName(block.$element, 'bre-block-selected', selected);

  if (selected) {
    showBlockEditor(block, active);
  } else {
    hideBlockEditor(block);
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
    fields: [],
  }
): bre.block.Block => {
  const $element = $template.cloneNode(true) as HTMLElement;
  helpers.toggleClassName($element, 'bre-template', false);
  helpers.toggleClassName($element, 'bre-template-zoom', false);
  helpers.toggleClassName($element, 'bre-block', true);

  const block: bre.block.Block = {
    parentContainer,
    $element,
    data,
    selected: false,
  };

  $element.addEventListener('click', () => {
    toggleBlockSelection(block, true, true);
  });

  block.fields = bindBlockFields(block);
  // block.fields.forEach(field => {
  //   if (field.on !== undefined) {
  //     field.on("select", () => {
  //       selectField(field);
  //     });
  //   }
  // });

  return block;
};

// TODO:
export const getBlockHtml = (block: bre.block.Block, trim: boolean = true) => {
  return '';

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

// export const getParentBlocks = (block: bre.block.Block): bre.block.Block[] => {
//   const parentBlocks: bre.block.Block[] = [];

//   let { parentContainerField } = block.parentContainer;
//   while (
//     parentContainerField !== null &&
//     parentContainerField.parentBlock !== null
//   ) {
//     const { parentBlock } = parentContainerField;
//     parentBlocks.push(parentBlock);
//     parentContainerField = parentBlock.parentContainer.parentContainerField;
//   }

//   return parentBlocks;
// };

// const getBlockChain = (field: bre.field.FieldBase) => {
//   const block = field.parentBlock;
//   block.parentContainer;
// };
