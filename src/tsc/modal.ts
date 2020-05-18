import { bre } from '@/types/bre';
import { helpers } from '@/helpers';

export const modal: bre.EditorModal = (
  $content: HTMLElement,
  ok?: () => void,
  cancel?: () => void
) => {
  const selection = helpers.getSelectionRanges();

  const root = helpers.div('bre-modal');

  const close = () => {
    root.remove();
    helpers.restoreSelection(selection);
  };

  const $ok = helpers.el<HTMLButtonElement>({
    tag: 'button',
    props: {
      type: 'button',
      onclick: () => {
        if (ok) {
          ok();
        }
        close();
      },
      innerHTML: 'Ok',
    },
  });

  const $cancel = helpers.el<HTMLButtonElement>({
    tag: 'button',
    props: {
      type: 'button',
      onclick: () => {
        if (cancel) {
          cancel();
        }
        close();
      },
      innerHTML: 'Cancel',
    },
  });

  const $placeholder = helpers.div('bre-modal-placeholder');
  $placeholder.append($content, $ok, $cancel);
  root.append($placeholder);

  document.body.appendChild(root);
};
