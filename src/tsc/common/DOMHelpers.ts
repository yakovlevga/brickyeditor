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
}
