import { getSelectionRanges, restoreSelection } from "src/ui/SelectionUtils";
import { bre } from "src/types/bre";

type FieldData = bre.core.field.FieldData;

const div = <TClassName extends string>(
  className: TClassName,
  innerHTML?: string | null
) => {
  const result = document.createElement("div");
  result.className = className;
  if (innerHTML !== undefined && innerHTML !== null) {
    result.innerHTML = innerHTML;
  }
  return result;
};

const createElement = <TElement extends HTMLElement>(
  html: string,
  className?: string
): TElement => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const result = temp.children[0] as TElement;
  temp.innerHTML = "";

  if (className !== undefined) {
    result.className = className;
  }

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
  <div class="bre-modal">
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

const parseElementData = (el: HTMLElement, prop: string): FieldData | null => {
  let json = el.dataset[prop];
  if (json === undefined) {
    return null;
  }

  let data: FieldData | null = null;

  try {
    data = JSON.parse(json);
  } catch (e) {
    if (e instanceof SyntaxError) {
      json = json.replace(/'/g, '"');
      try {
        data = JSON.parse(json) as FieldData;

        if (data.name === undefined || data.type === undefined) {
          return null;
          // TODO throw error or return null from one source
          // throw new Error(
          //   `There is no data defined in a field: ${el.innerHTML}`
          // );
        }
      } catch {
        // TODO: log error
        return null;
      }
    }
  }

  return data;
};

const readFileAsync = async (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader: FileReader = new FileReader();

    reader.onload = ev => {
      if (ev.target !== null && ev.target.result !== null) {
        const result = ev.target.result.toString();
        resolve(result);
      }
    };

    try {
      reader.readAsDataURL(file);
    } catch (ex) {
      reject(ex);
    }
  });

const filterNotNull = <TValue>(value: (TValue | null)[]) =>
  value.filter(x => x !== null) as TValue[];

export const helpers = {
  createElement,
  div,
  parseElementData,
  showModal,
  toggleVisibility,
  readFileAsync,
  filterNotNull
};
