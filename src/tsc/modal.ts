import { getSelectionRanges, restoreSelection } from "@/ui/selection";
import { helpers } from "@/helpers";

export const dialog = (
  $content: HTMLElement,
  ok?: () => void,
  cancel?: () => void
) => {
  const selection = getSelectionRanges();

  const root = helpers.div("bre-modal");

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

  const $placeholder = helpers.div("bre-modal-placeholder");
  $placeholder.append($content, $ok, $cancel);
  root.append($placeholder);

  document.body.appendChild(root);
};
