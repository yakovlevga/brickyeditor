import { bre } from '@/types/bre';
import { FIELD_SELECTOR, FIELD_DATA_ATTR } from '@/constants';

export const findFieldElements = ($html: HTMLElement) => {
  const nodes = $html.querySelectorAll<HTMLElement>(FIELD_SELECTOR);
  let $fields: HTMLElement[] =
    nodes.length > 0 ? Array.prototype.slice.call(nodes) : [];

  if ($html.attributes.getNamedItem(FIELD_DATA_ATTR) !== null) {
    $fields = [...$fields, $html];
  }

  return $fields;
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
