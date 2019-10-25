const createElement = <TElement extends HTMLElement>(
  html: string
): TElement => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const result = temp.children[0] as TElement;
  temp.innerHTML = null;
  return result;
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
  let element = createElement(modalTemplate);
  const placeholder = element.getElementsByClassName(
    "bre-modal-placeholder"
  )[0];

  const closeModal = () => {
    element.remove();
    element = null;
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
    onCancel();
    closeModal();
  });
  placeholder.appendChild(buttonCancel);

  document.body.appendChild(element);
};

export const helpers = { createElement, showModal };
