const dataSave = "data-save";
const dataCancel = "data-cancel";

const getElement = (params: bre.prompt.PromptParameter[]) => {
  const fields = params
    .map(p => {
      const val = p.value || "";
      return `
          <div>
            <label>
                ${p.title}<br />
                <input type='text' name='${p.key}' placeholder='${p.placeholder}' value='${val}'/>
            </label>
          </div>`;
    })
    .join("");

  const template = `
      <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; background-color: #fff;">
        <h3>modal</h3>
        ${fields}
        <button type="button" ${dataSave}="true">Save</button>
        <button type="button" ${dataCancel}="true">Cancel</button>
      </div>`;

  const div = document.createElement("div");
  div.innerHTML = template;
  const el = div.children[0];
  document.body.appendChild(el);

  return el;
};

type ModalResult = {
  [TKey: string]: string;
};

export const prompt: (
  params: bre.prompt.PromptParameter[]
) => Promise<ModalResult> = params =>
  new Promise<ModalResult>((resolve, reject) => {
    const el = getElement(params);

    const closeModal = () => {
      document.body.removeChild(el);
      reject();
    };

    const onSave = () => {
      const result: ModalResult = {};
      params.forEach(p => {
        const paramEl: HTMLInputElement = el.querySelector(`[name=${p.key}]`);
        result[p.key] = paramEl.value;
      });
      resolve(result);
      closeModal();
    };

    const save = el.querySelector<HTMLButtonElement>(`[${dataSave}]`);
    save.onclick = onSave;

    const cancel = el.querySelector<HTMLButtonElement>(`[${dataCancel}]`);
    cancel.onclick = closeModal;
  });
