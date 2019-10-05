const dataSave = "data-save";
const dataCancel = "data-cancel";

const getElement = (params: { [TKey: string]: bre.prompt.PromptParameter }) => {
  const fields = Object.keys(params).map(key => {
    const p = params[key];
    const val = p.value || "";
    return `
          <div>
            <label>
                ${p.title}<br />
                <input type='text' name='${key}' placeholder='${p.placeholder}' value='${val}'/>
            </label>
          </div>`;
  });

  const template = `<div>
    <div class="bre-modal" style="display: block;">
      <div class="bre-modal-placeholder">
        <form>
          <h3>modal</h3>
          ${fields.join("")}
          <button type="button" ${dataSave}="true">Save</button>
          <button type="button" ${dataCancel}="true">Cancel</button>
        </form>
      </div>
    </div>
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
