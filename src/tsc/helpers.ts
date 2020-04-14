import { bre } from '@/types/bre';
import { Locale } from '@/i18n';

type FieldData = bre.field.FieldData;

const el = <THTMLElement extends HTMLElement = HTMLElement>({
  tag = 'div',
  className,
  innerHTML,
  props,
}: {
  tag?: string;
  className?: BreStyles | BreStyles[];
  innerHTML?: string;
  props?: Partial<THTMLElement>;
}) => {
  const result = document.createElement(tag) as THTMLElement;

  if (className !== undefined) {
    if (Array.isArray(className)) {
      className.forEach(x => result.classList.add(x));
    } else {
      result.className = className;
    }
  }

  if (innerHTML !== undefined) {
    result.innerHTML = innerHTML;
  }

  if (props !== undefined) {
    Object.assign(result, props);
  }

  return result;
};

const div = (className?: BreStyles | BreStyles[], innerHTML?: string) =>
  el<HTMLDivElement>({
    className,
    innerHTML,
  });

const createElement = <TElement extends HTMLElement>(
  html: string,
  className?: string
): TElement => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const result = temp.children[0] as TElement;
  temp.innerHTML = '';

  if (className !== undefined) {
    result.className = className;
  }

  return result;
};

const hiddenClassName: BreStyles = 'bre-hidden';
const toggleVisibility = (el: HTMLElement, visible?: boolean) => {
  if (visible === undefined) {
    visible = el.classList.contains(hiddenClassName);
  }

  toggleClassName(el, hiddenClassName, !visible);
};

const toggleClassName = (
  el: HTMLElement,
  className: BreStyles,
  force?: boolean
) => el.classList.toggle(className, force);

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

const objectToArray = (o: any) => Object.keys(o).map(x => x[o]);

const filterNotNull = <TValue>(value: (TValue | null)[]) =>
  value.filter(x => x !== null) as TValue[];

export const strEqualsInvariant = (s1: string, s2: string) => {
  if (!s1 || !s2) {
    return s1 === s2;
  }

  return s1.toLowerCase() === s2.toLowerCase();
};

const convertNodeListToArray = <TNode extends Node>(nl: NodeListOf<TNode>) => {
  return Array.prototype.slice.call(nl) as TNode[];
};

const msg = (key: keyof Locale, params?: Record<string, string>) => {
  window.BrickyEditor.i18n.default = 'en';
  window.BrickyEditor.i18n.locale = 'en';

  const locale =
    window.BrickyEditor.i18n.messages[window.BrickyEditor.i18n.locale] ||
    window.BrickyEditor.i18n.messages[window.BrickyEditor.i18n.default];

  let str = locale[key];

  if (str === undefined) {
    // TODO: log missing message
    return '';
  }

  if (params !== undefined) {
    Object.keys(params).forEach(p => {
      str.replace(/`{${p}}`/g, params[p]);
    });
  }
  return str;
};

export const helpers = {
  createElement,
  div,
  el,
  parseElementData,
  toggleVisibility,
  toggleClassName,
  readFileAsync,
  objectToArray,
  filterNotNull,
  convertNodeListToArray,
  msg,
};
