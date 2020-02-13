import { toggleFieldSelection } from "@/fields/field";
import { getTemplate } from "@/template";
import { bre } from "@/types/bre";
import { Selectors } from "@/ui/Selectors";
import { showBlockEditor, hideBlockEditor } from "@/block/blockEditor";
import { emitter } from "@/emitter";
import { bindBlockFields } from "@/fields/fields";

export const selectField = (
  block: bre.block.Block,
  field: bre.field.FieldBase
) => {
  block.selectedField = field;
};

export const toggleBlockSelection = (
  block: bre.block.Block,
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
  blockData: bre.block.BlockData
): bre.block.Block => {
  const blockTemplate = getTemplate(blockData.template);
  debugger;
  return createBlockFromTemplate(
    blockTemplate.name,
    blockTemplate.$template,
    blockData
  );
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
      field.on("focus", f => {
        if (f !== undefined) {
          selectField(block, f.field);
        }
      });
    }
  });

  return block;
};
