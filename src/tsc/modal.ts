import { getSelectionRanges, restoreSelection } from "src/ui/selection";
import { helpers } from "src/helpers";
import { ModalStyles } from "src/modal.scss";

export const dialog = (
  $content: HTMLElement,
  ok?: () => void,
  cancel?: () => void
) => {
  const selection = getSelectionRanges();

  const root = helpers.div<ModalStyles>("bre-modal");

  const close = () => {
    root.remove();
    restoreSelection(selection);
  };

  const $ok = helpers.el<HTMLButtonElement>({
    tag: "button",
    props: {
      type: "button",
      onclick: () => {
        if (ok) {
          ok();
        }
        close();
      },
      innerHTML: "Ok"
    }
  });

  const $cancel = helpers.el<HTMLButtonElement>({
    tag: "button",
    props: {
      type: "button",
      onclick: () => {
        if (cancel) {
          cancel();
        }
        close();
      },
      innerHTML: "Cancel"
    }
  });

  const $placeholder = helpers.div<ModalStyles>("bre-modal-placeholder");
  $placeholder.append($content, $ok, $cancel);
  root.append($placeholder);

  document.body.appendChild(root);
};
