import { bre } from "src/types/bre";

interface FieldEvent {
  field: bre.ui.FieldBase;
}

export interface FieldEventMap {
  change: FieldEvent;
  focus: FieldEvent;
  blur: FieldEvent;
}

export interface TemplatesEventMap {
  templateClick: {
    template: bre.core.ITemplate;
  };
}

type BlockEvent<T = {}> = T;
export interface BlockEventMap {
  delete: BlockEvent;
  clone: BlockEvent;
  move: BlockEvent<{
    offset: number;
  }>;
  // for extensions
  // [TKey: string]: BlockEvent;
}

type BreEventMap = FieldEventMap | TemplatesEventMap | BlockEventMap;

export type Emitter<TEventMap extends BreEventMap> = {
  fire: FireFunc<TEventMap>;
  on: OnOffFunc<TEventMap>;
  off: OnOffFunc<TEventMap>;
};

export type OnOffFunc<TEventMap extends BreEventMap> = <
  K extends keyof TEventMap
>(
  type: K,
  listener: (ev?: TEventMap[K]) => void
) => void;

export type FireFunc<TEventMap extends BreEventMap> = <
  K extends keyof TEventMap
>(
  type: K,
  ev?: TEventMap[K]
) => void;

export const emmiter = <
  TEventMap extends BreEventMap
>(): Emitter<TEventMap> => {
  const listeners: {
    [K in keyof TEventMap]?: Array<(ev?: TEventMap[K]) => void>;
  } = {};

  const on: OnOffFunc<TEventMap> = (type, listener) => {
    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    const listenersOfType = listeners[type]!;

    if (listenersOfType.indexOf(listener) !== -1) {
      return;
    }

    listenersOfType.push(listener);
  };

  const off: OnOffFunc<TEventMap> = (type, listener) => {
    const listenersOfType = listeners[type];
    if (listenersOfType === undefined) {
      return;
    } else {
      const idx = listenersOfType.indexOf(listener);
      if (idx > -1) {
        listenersOfType.splice(idx, 1);
      }
    }
  };

  const fire: FireFunc<TEventMap> = (type, ev) => {
    const listenersOfType = listeners[type];
    if (listenersOfType === undefined) {
      return;
    } else {
      listenersOfType.forEach(listener => listener(ev));
    }
  };

  return { fire, on, off };
};
