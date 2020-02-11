export class $dom {
  public static before(
    el: HTMLElement,
    elToInsert: HTMLElement | HTMLElement[]
  ) {
    if (elToInsert instanceof HTMLElement) {
      if (el.parentNode !== null) {
        el.parentNode.insertBefore(elToInsert, el);
      }
    } else {
      elToInsert.forEach($el => this.before(el, $el));
    }
  }

  public static after(el: HTMLElement, elToInsert: HTMLElement) {
    if (el.parentNode === null) {
      return;
    }

    if (el.nextSibling) {
      el.parentNode.insertBefore(elToInsert, el);
    } else {
      el.parentNode.appendChild(elToInsert);
    }
  }

  // IE9+
  // http://youmightnotneedjquery.com/
  // public static trigger(el: Element, ev: string, data: any) {
  //   if ((window as any).CustomEvent) {
  //     const event = new CustomEvent(ev, { detail: data });
  //   } else {
  //     const event = document.createEvent("CustomEvent");
  //     event.initCustomEvent(ev, true, true, data);
  //   }
  //   el.dispatchEvent(event);
  // }

  public static matches(el: Element, selector: string) {
    const matches =
      el.matches ||
      el.matchesSelector ||
      el.msMatchesSelector ||
      el.mozMatchesSelector ||
      el.webkitMatchesSelector ||
      el.oMatchesSelector;

    return matches.call(el, selector);
  }
}
