import { bre } from '@/types/bre';
import { helpers } from '@/helpers';
import { toggleBlockSelection } from '@/block/toggleBlockSelection';
import { setupBlockFields } from '@/block/setupBlockFields';

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

  block.fields = setupBlockFields(block);
  // block.fields.forEach(field => {
  //   if (field.on !== undefined) {
  //     field.on("select", () => {
  //       selectField(field);
  //     });
  //   }
  // });

  return block;
};
