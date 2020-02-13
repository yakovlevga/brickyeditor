import { bre } from "@/types/bre";

type FieldData = bre.field.FieldData;

const el = <THTMLElement extends HTMLElement = HTMLElement>({
  tag = "div",
  className,
  innerHTML,
  props
}: {
  tag?: string;
  className?: BreStyles;
  innerHTML?: string;
  props?: Partial<THTMLElement>;
}) => {
  const result = document.createElement(tag) as THTMLElement;

  if (className !== undefined && className.length > 0) {
    result.className = className;
  }

  if (innerHTML !== undefined) {
    result.innerHTML = innerHTML;
  }

  if (props !== undefined) {
    Object.assign(result, props);
  }

  return result;
};

const div = (className?: BreStyles, innerHTML?: string) =>
  el<HTMLDivElement>({
    className,
    innerHTML
  });

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

const insertBefore = (
  el: HTMLElement,
  elToInsert: HTMLElement | HTMLElement[]
) => {
  if (elToInsert instanceof HTMLElement) {
    if (el.parentNode !== null) {
      el.parentNode.insertBefore(elToInsert, el);
    }
  } else {
    elToInsert.forEach($el => insertBefore(el, $el));
  }
};

const insertAfter = (el: HTMLElement, elToInsert: HTMLElement) => {
  if (el.parentNode === null) {
    return;
  }

  if (el.nextSibling) {
    el.parentNode.insertBefore(elToInsert, el);
  } else {
    el.parentNode.appendChild(elToInsert);
  }
};

export const helpers = {
  createElement,
  div,
  el,
  parseElementData,
  toggleVisibility,
  readFileAsync,
  objectToArray,
  filterNotNull,

  insertBefore,
  insertAfter
};
