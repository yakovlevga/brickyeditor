import { getSelectionRanges, restoreSelection } from "src/ui/selection";
import { helpers } from "src/helpers";
import { ModalStyles } from "src/modal.scss";

export const dialog = (props: {
  content: HTMLElement | HTMLElement[];
  ok?: () => void;
  cancel?: () => void;
}) => {
  const selection = getSelectionRanges();

  const root = helpers.div<ModalStyles>("bre-modal");

  const close = () => {
    root.remove();
    (root as any) = null;

    restoreSelection(selection);
  };

  const { content, ok, cancel } = props;

  const buttonOk = helpers.el<HTMLButtonElement>({
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

  const buttonCancel = helpers.el<HTMLButtonElement>({
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
  if (Array.isArray(content)) {
    content.forEach(el => $placeholder.append(el));
  } else {
    $placeholder.append(content);
  }

  $placeholder.append(buttonOk, buttonCancel);
  root.append($placeholder);

  document.body.appendChild(root);
};
