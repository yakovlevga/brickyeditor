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
    if (tag === 'textarea') {
      // const { type, ...restProps } = props;
      // Object.assign(result, restProps);
      // TODO
      Object.assign(result, props);
    } else {
      Object.assign(result, props);
    }
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
  const locale =
    window.BrickyEditor.i18n.messages[window.BrickyEditor.i18n.locale];

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

export const getSelectionRanges = () => {
  const selection = window.getSelection();
  if (selection === null || selection.rangeCount === 0) {
    return null;
  }

  const selectionRanges = [];
  for (let idx = 0; idx < selection.rangeCount; idx++) {
    selectionRanges.push(selection.getRangeAt(idx));
  }
  return selectionRanges;
};

export const restoreSelection = (selectionRanges: Range[] | null) => {
  if (selectionRanges === null || selectionRanges.length === 0) {
    return;
  }

  const selection = window.getSelection();
  if (selection !== null) {
    selection.removeAllRanges();
    selectionRanges.forEach(range => selection.addRange(range));
  }
};

export const reInjectScript = ($script: HTMLScriptElement): void => {
  if ($script.parentNode !== null) {
    $script.parentNode.removeChild($script);
  }

  var $reAppended = document.createElement('script');
  $reAppended.type = $script.type;
  $reAppended.async = true;
  $reAppended.src = $script.src;
  document.head.appendChild($reAppended);
  // s.parentNode!.insertBefore(po, s);
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
  getSelectionRanges,
  restoreSelection,
  reInjectScript,
};
