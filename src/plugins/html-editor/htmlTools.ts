import { bre } from '@/types/bre';
import { linkEditor } from '@/fields/linkEditor';
import { HtmlToolsButton } from './index';

const promptLinkParamsAsync = (
  modal: bre.EditorModal,
  initialData: Readonly<bre.LinkData>
) =>
  new Promise<bre.LinkData | null>(resolve => {
    const { $element: $editor, data: updatedData } = linkEditor(initialData);
    modal(
      $editor,
      () => {
        resolve(updatedData);
      },
      () => {
        resolve(null);
      }
    );
  });

const renderButtonElement = (
  modal: bre.EditorModal,
  helpers: bre.EditorHelpers,
  { icon, command, range }: HtmlToolsButton
): HTMLElement => {
  const $btn = helpers.div(
    ['bre-block-editor-button', 'bre-icon', 'bre-icon-light'],
    icon
  );

  $btn.onclick = async () => {
    let selection = window.getSelection();
    let selectionRange =
      selection !== null && selection.rangeCount > 0
        ? selection.getRangeAt(0)
        : null;

    console.log({ selection });

    if (range && !selectionRange) {
      return;
    }

    if (command === 'CreateLink' && selection !== null) {
      await createLinkCmd(selection, modal);
    } else {
      document.execCommand(command);
    }

    return;
  };

  return $btn;
};

const getSeletedLink = (selection: Selection) => {
  if (
    selection.anchorNode !== null &&
    selection.anchorNode.parentNode !== null &&
    selection.anchorNode.parentNode.nodeName.toLowerCase() === 'a'
  ) {
    return selection.anchorNode.parentNode as HTMLLinkElement;
  }

  return null;
};

const renderControl = (
  modal: bre.EditorModal,
  helpers: bre.EditorHelpers,
  buttons: HtmlToolsButton[]
) => {
  const $root = helpers.div('bre-block-editor');

  buttons
    .map(btn => renderButtonElement(modal, helpers, btn))
    .forEach($btn => $root.appendChild($btn));

  helpers.toggleVisibility($root, false);

  return $root;
};

export const initHtmlTools = (
  modal: bre.EditorModal,
  helpers: bre.EditorHelpers,
  buttons?: HtmlToolsButton[]
) => {
  if (buttons === undefined || buttons.length === 0) {
    return null;
  }

  const $control = renderControl(modal, helpers, buttons);
  document.body.appendChild($control);

  return $control;
};

export const toggleHtmlTools = (
  $control: HTMLElement,
  rect: ClientRect | null,
  helpers: bre.EditorHelpers
) => {
  if (rect !== null && rect.width > 1) {
    const top = rect.top + rect.height;
    const left = rect.left;
    $control.style.top = `${top}px`;
    $control.style.left = `${left}px`;
    helpers.toggleVisibility($control, true);
  } else {
    helpers.toggleVisibility($control, false);
  }
};

export const bindTextSelection = (
  $el: HTMLElement,
  handler: (rect: ClientRect | null) => any
) => {
  if (!$el.contentEditable) {
    return;
  }

  $el.addEventListener('mouseup', () => {
    setTimeout(() => {
      const rect = getSelectionRect();
      handler(rect);
    }, 0);
  });

  $el.addEventListener('keyup', () => {
    const rect = getSelectionRect();
    handler(rect);
  });
};

const getSelectionRect = () => {
  const selection = window.getSelection();
  if (selection === null) {
    return null;
  }

  const range = selection.getRangeAt(0);
  return range.getBoundingClientRect();
};

async function createLinkCmd(selection: Selection, modal: bre.EditorModal) {
  const selectedLink = getSeletedLink(selection);
  const currentLink =
    selectedLink !== null
      ? {
          href: selectedLink.href,
          title: selectedLink.title,
          target: selectedLink.target,
        }
      : {};
  const updatedLink = await promptLinkParamsAsync(modal, currentLink);
  if (updatedLink !== null && updatedLink.href) {
    document.execCommand('CreateLink', false, updatedLink.href);

    if (
      selection.anchorNode !== null &&
      selection.anchorNode.parentElement !== null
    ) {
      if (updatedLink.target) {
        selection.anchorNode.parentElement.setAttribute(
          'target',
          updatedLink.target
        );
      }
      if (updatedLink.title) {
        selection.anchorNode.parentElement.setAttribute(
          'title',
          updatedLink.title
        );
      }
    }
  }
}
