import { bre } from '@/types/bre';
import { helpers } from '@/helpers';

const fixBodyClassName: BreStyles = 'bre-modal-fix-body';

export const modal: bre.EditorModal = (
  $content: HTMLElement,
  okHandler?: () => void,
  cancelHandler?: () => void
) => {
  document.body.classList.add(fixBodyClassName);

  const selection = helpers.getSelectionRanges();

  const $modal = helpers.div('bre-modal');

  const onLightboxClick = () => close();
  const $lightbox = helpers.div('bre-modal-lightbox');
  $lightbox.addEventListener('click', onLightboxClick);

  const onEscEvent = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' || ev.key === 'Esc' || ev.keyCode === 27) {
      close();
    }
  };
  document.addEventListener('keydown', onEscEvent);

  const close = () => {
    document.body.classList.remove(fixBodyClassName);

    $modal.remove();
    helpers.restoreSelection(selection);
    document.removeEventListener('keydown', onEscEvent);
    $lightbox.removeEventListener('click', onLightboxClick);
  };

  const $ok = helpers.el<HTMLButtonElement>({
    tag: 'button',
    className: 'bre-btn',
    innerHTML: helpers.msg('button.ok'),
    props: {
      type: 'button',
      onclick: () => {
        if (okHandler) {
          okHandler();
        }
        close();
      },
    },
  });

  const $cancel = helpers.el<HTMLButtonElement>({
    tag: 'button',
    className: ['bre-btn', 'bre-btn-clear'],
    innerHTML: helpers.msg('button.cancel'),
    props: {
      type: 'button',
      onclick: () => {
        if (cancelHandler) {
          cancelHandler();
        }
        close();
      },
    },
  });

  const $btns = helpers.div('bre-btns');
  $btns.append($cancel, $ok);

  const $modalContent = helpers.div('bre-modal-content');
  $modalContent.append($content);

  const $modalRoot = helpers.div('bre-modal-root');
  $modalRoot.append($modalContent, $btns);

  $modal.append($lightbox, $modalRoot);

  document.body.appendChild($modal);
};
