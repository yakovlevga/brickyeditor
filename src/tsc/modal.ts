const dataSave = "data-save";
const dataCancel = "data-cancel";

const getElement = (params: { [TKey: string]: bre.prompt.PromptParameter }) => {
  const fields = Object.keys(params)
    .map(key => {
      const p = params[key];
      const val = p.value || "";
      return `
          <div>
            <label>
                ${p.title}<br />
                <input type='text' name='${key}' placeholder='${p.placeholder}' value='${val}'/>
            </label>
          </div>`;
    })
    .join("");

  const template = `
      <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 10000; background-color: #eee;">
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

export const prompt = <TParams extends bre.prompt.PromptParameters>(
  params: TParams
): Promise<
  {
    [TKey in keyof TParams]?: string;
  }
> =>
  new Promise<
    {
      [TKey in keyof TParams]?: any;
    }
  >(resolve => {
    const el = getElement(params);

    const closeModal = () => {
      document.body.removeChild(el);
      resolve(null);
    };

    const onSave = () => {
      // tslint:disable-next-line:prefer-const
      let result: {
        [TKey in keyof TParams]?: string;
      } = {};

      Object.keys(params).map((key: keyof TParams) => {
        const paramEl: HTMLInputElement = el.querySelector(`[name=${key}]`);
        const value =
          paramEl.value && paramEl.value.length > 0 ? paramEl.value : undefined;
        if (value) {
          result[key] = value;
        }
      });
      resolve(result);
      closeModal();
    };

    const save = el.querySelector<HTMLButtonElement>(`[${dataSave}]`);
    save.onclick = onSave;

    const cancel = el.querySelector<HTMLButtonElement>(`[${dataCancel}]`);
    cancel.onclick = closeModal;
  });
