import { getSelectionRanges, restoreSelection } from "src/ui/SelectionUtils";

const createElement = <TElement extends HTMLElement>(
  html: string
): TElement => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const result = temp.children[0] as TElement;
  temp.innerHTML = "";
  return result;
};

const toggleVisibility = (el: HTMLElement, visible?: boolean) => {
  if (visible !== undefined) {
    el.style.display = visible ? "initial" : "none";
    return;
  }

  el.style.display = el.style.display !== "none" ? "none" : "initial";
};

const modalTemplate = `
<div>
  <div class="bre-modal" style="display: block;">
    <div class="bre-modal-placeholder">
    </div>
  </div>
</div>`;

const showModal = (props: {
  content: HTMLElement[];
  onOk?: () => void;
  onCancel?: () => void;
}) => {
  const selection = getSelectionRanges();

  const element = createElement(modalTemplate);
  const placeholder = element.getElementsByClassName(
    "bre-modal-placeholder"
  )[0];

  const closeModal = () => {
    element.remove();
    (element as any) = null;

    restoreSelection(selection);
  };

  const { content, onOk, onCancel } = props;
  content.forEach(el => placeholder.appendChild(el));

  if (onOk !== undefined) {
    const buttonOk = createElement<HTMLButtonElement>(
      `<button type="button">Save</button>`
    );
    buttonOk.addEventListener("click", () => {
      onOk();
      closeModal();
    });
    placeholder.appendChild(buttonOk);
  }

  const buttonCancel = createElement<HTMLButtonElement>(
    `<button type="button">Cancel</button>`
  );
  buttonCancel.addEventListener("click", () => {
    if (onCancel) {
      onCancel();
    }
    closeModal();
  });
  placeholder.appendChild(buttonCancel);

  document.body.appendChild(element);
};

const parseElementData = <TData>(
  el: HTMLElement,
  prop: string
): TData | null => {
  let json = el.dataset[prop];
  if (json === undefined) {
    return null;
  }

  let data: TData | null = null;

  try {
    data = JSON.parse(json);
  } catch (e) {
    if (e instanceof SyntaxError) {
      json = json.replace(/'/g, '"');
      try {
        data = JSON.parse(json) as TData;
      } catch {
        // TODO: log error
        return null;
      }
    }
  }

  return data;
};

export const helpers = {
  createElement,
  parseElementData,
  showModal,
  toggleVisibility,
};
