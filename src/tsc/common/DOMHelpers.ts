export class $dom {
  static offset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const $body = document.body;

    return {
      top: rect.top + $body.scrollTop,
      left: rect.left + $body.scrollLeft
    };
  }

  static unwrap(el: HTMLElement) {
    if (!el.parentElement) {
      return;
    }

    var parentsParent = el.parentElement.parentElement;
    if (parentsParent) {
      parentsParent.replaceChild(el, el.parentElement);
    } else {
      el.parentElement.innerHTML = el.innerHTML;
    }
  }

  // IE8+
  // http://youmightnotneedjquery.com/
  public static hide(el: HTMLElement) {
    el.style.display = "none";
  }

  // IE8+
  // http://youmightnotneedjquery.com/
  public static show(el: HTMLElement) {
    el.style.display = "block";
  }

  // https://stackoverflow.com/a/21696585
  public static isHidden(el: HTMLElement) {
    var style = window.getComputedStyle(el);
    return style.display === "none";
  }

  // IE8+
  // http://youmightnotneedjquery.com/
  public static toggle(el: HTMLElement, force?: boolean) {
    const show = force ? force.valueOf() : this.isHidden(el);
    if (show) {
      this.show(el);
    } else {
      this.hide(el);
    }
  }

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

  // IE8+
  // http://youmightnotneedjquery.com/
  public static hasClass(el: HTMLElement, className: string) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
    }
  }

  // IE8+
  // http://youmightnotneedjquery.com/
  public static addClass(el: HTMLElement, className: string) {
    if (this.hasClass(el, className)) {
      return;
    }

    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += " " + className;
    }
  }

  // IE8+
  // http://youmightnotneedjquery.com/
  public static removeClass(el: HTMLElement, className: string) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
    }
  }

  // IE8+
  // http://youmightnotneedjquery.com/
  public static toggleClass(
    el: HTMLElement,
    className: string,
    force?: boolean
  ) {
    if (force) {
      if (force.valueOf()) {
        this.addClass(el, className);
      } else {
        this.removeClass(el, className);
      }
      return;
    }

    if (el.classList) {
      el.classList.toggle(className);
    } else {
      const classes = el.className.split(" ");
      let existingIndex = -1;
      for (let i = classes.length; i--; ) {
        if (classes[i] === className) {
          existingIndex = i;
        }
      }

      if (existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(className);
      }

      el.className = classes.join(" ");
    }
  }

  public static windowScrollTop(): number {
    return window.pageYOffset !== undefined
      ? window.pageYOffset
      : ((document.documentElement ||
          document.body.parentNode ||
          document.body) as any).scrollTop;
  }

  public static replaceWith(from: HTMLElement, to: HTMLElement) {
    const parent = from.parentElement;
    if (parent) {
      parent.replaceChild(to, from);
    }
  }

  public static select(
    el: HTMLElement,
    selector: string,
    addBack: boolean = false
  ): HTMLElement[] {
    const elements = el.querySelectorAll(selector);
    const result = Array.prototype.slice.call(elements) as HTMLElement[];

    if (addBack && addBack.valueOf() && $dom.matches(el, selector)) {
      result.push(el);
    }
    return result;
  }

  public static find(selector: string): HTMLElement {
    return document.querySelector(selector);
  }

  public static first(el: HTMLElement, selector: string): HTMLElement {
    return el.querySelector(selector);
  }

  public static clone(el: Element): HTMLElement {
    return el.cloneNode(true) as HTMLElement;
  }

  // IE9+
  // http://youmightnotneedjquery.com/
  public static trigger(el: Element, ev: string, data: any) {
    if ((window as any).CustomEvent) {
      const event = new CustomEvent(ev, { detail: data });
    } else {
      const event = document.createEvent("CustomEvent");
      event.initCustomEvent(ev, true, true, data);
    }
    el.dispatchEvent(event);
  }

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

  public static data<T>(el: HTMLElement, prop: string): T {
    let json = el.dataset[prop];
    let data: T = null;

    try {
      data = JSON.parse(json) as T;
    } catch (e) {
      if (e instanceof SyntaxError) {
        json = json.replace(/'/g, '"');
        try {
          data = JSON.parse(json) as T;
        } catch {}
      }
    }

    return data;
  }
}
