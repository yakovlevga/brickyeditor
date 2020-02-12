import { toggleFieldSelection } from "@/fields/field";
import { getTemplate } from "@/template";
import { bre } from "@/types/bre";
import { Selectors } from "@/ui/Selectors";
import { showBlockEditor, hideBlockEditor } from "@/block/blockEditor";
import { emmiter, BlockEventMap } from "@/emmiter";
import { bindFields } from "@/fields/fields";

export const selectField = (
  block: bre.core.block.Block,
  field: bre.ui.FieldBase
) => {
  block.selectedField = field;
};

export const toggleBlockSelection = (
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

  // TODO: this should be called create fields or smth, should try drop block dependency from args
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

// export const getBlockHtml = (block: bre.core.block.Block, trim: boolean) => {
//   const $element = block.$element.cloneNode(true);
//   if (block.fields !== undefined) {
//     block.fields.forEach(f => {
//       const name = (f as bre.ui.Field<bre.core.field.FieldData>).data.name;
//     });
//   }
// };
