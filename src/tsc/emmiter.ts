import { bre } from "src/types/bre";

interface FieldEvent {
  field: bre.ui.FieldBase;
}

interface FieldEventMap {
  change: FieldEvent;
  focus: FieldEvent;
  blur: FieldEvent;
}

export type OnOffFunc = <K extends keyof FieldEventMap>(
  type: K,
  listener: (ev: FieldEventMap[K]) => void
) => void;

export type FireFunc = <K extends keyof FieldEventMap>(
  type: K,
  ev: FieldEventMap[K]
) => void;

// export type EvEmitter = {
//   on: OnOffFunc;
//   off: OnOffFunc;
//   fire: FireFunc;
// };

export const emmiter = (obj: { on?: OnOffFunc; off?: OnOffFunc }): FireFunc => {
  const listeners: {
    [K in keyof FieldEventMap]?: Array<(ev: FieldEventMap[K]) => void>;
  } = {};

  obj.on = (type, listener) => {
    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    const listenersOfType = listeners[type]!;

    if (listenersOfType.indexOf(listener) !== -1) {
      return;
    }

    listenersOfType.push(listener);
  };

  obj.off = (type, listener) => {
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

  const fire: FireFunc = (type, ev) => {
    const listenersOfType = listeners[type];
    if (listenersOfType === undefined) {
      return;
    } else {
      listenersOfType.forEach(listener => listener(ev));
    }
  };

  return fire;
};
