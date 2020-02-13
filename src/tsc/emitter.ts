import { bre } from "@/types/bre";

export const emitter = <
  TEventMap extends bre.event.EventMaps
>(): bre.event.Emitter<TEventMap> => {
  const listeners: {
    [K in keyof TEventMap]?: Array<(ev?: TEventMap[K]) => void>;
  } = {};

  const on: bre.event.OnOffFunc<TEventMap> = (type, listener) => {
    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    const listenersOfType = listeners[type]!;

    if (listenersOfType.indexOf(listener) !== -1) {
      return;
    }

    listenersOfType.push(listener);
  };

  const off: bre.event.OnOffFunc<TEventMap> = (type, listener) => {
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

  const fire: bre.event.FireFunc<TEventMap> = (type, ev) => {
    const listenersOfType = listeners[type];
    if (listenersOfType === undefined) {
      return;
    } else {
      listenersOfType.forEach(listener => listener(ev));
    }
  };

  return { fire, on, off };
};
