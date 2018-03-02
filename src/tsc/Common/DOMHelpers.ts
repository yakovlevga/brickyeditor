export class $dom {

    // Elements
    static el(html: string): HTMLElement {
        let div = document.createElement('div');
        div.innerHTML = html;
        const el = div.firstElementChild as HTMLElement;
        div.innerHTML = null;
        return el;
    }

    static ons(el: HTMLElement, events: string, listener: (this: HTMLElement, ev: any) => any, ) {
        events.split(' ').forEach(ev => {
            this.on(el, ev, listener);
        });
    }

    static on(el: HTMLElement, event: string, listener: (this: HTMLElement, ev: any) => any, ) {
        if ((<any>el).attachEvent)
            return (<any>el).attachEvent(`on${event}`, listener);
        else {
            return el.addEventListener(event, listener, false);
        }
    }

    static offset(el: HTMLElement) {
        const rect = el.getBoundingClientRect();
        const $body = document.body;

        return {
            top: rect.top + $body.scrollTop,
            left: rect.left + $body.scrollLeft
        }
    }

    static wrap(el: HTMLElement, toEl: HTMLElement) {
        el.parentElement.insertBefore(toEl, el);
        toEl.appendChild(el);
    }

    static unwrap(el: HTMLElement) {
        if (!el.parentElement) return;

        var parentsParent = el.parentElement.parentElement;
        if (parentsParent) {
            parentsParent.replaceChild(el, el.parentElement);
        }
        else {
            el.parentElement.innerHTML = el.innerHTML;
        }
    }

    // IE8+
    // http://youmightnotneedjquery.com/
    static hide(el: HTMLElement) {
        el.style.display = 'none';
    }

    // IE8+
    // http://youmightnotneedjquery.com/
    static show(el: HTMLElement) {
        el.style.display = 'block';
    }

    // https://stackoverflow.com/a/21696585
    static isHidden(el: HTMLElement) {
        var style = window.getComputedStyle(el);
        return (style.display === 'none')
    }

    // IE8+
    // http://youmightnotneedjquery.com/
    static toggle(el: HTMLElement, force?: boolean) {
        const show = force ? force.valueOf() : this.isHidden(el);
        if (show) this.show(el);
        else this.hide(el);
    }

    static before(el: HTMLElement, elToInsert: HTMLElement | HTMLElement[]) {
        if (elToInsert instanceof HTMLElement) {
            el.parentNode.insertBefore(elToInsert, el);
        }
        else {
            elToInsert.forEach($el => this.before(el, $el));
        }
    }

    static after(el: HTMLElement, elToInsert: HTMLElement) {
        if (el.nextSibling)
            el.parentNode.insertBefore(elToInsert, el);
        else
            el.parentNode.appendChild(elToInsert);
    }

    // IE8+
    // http://youmightnotneedjquery.com/
    static hasClass(el: HTMLElement, className: string) {
        if (el.classList)
            el.classList.contains(className);
        else
            new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    // IE8+
    // http://youmightnotneedjquery.com/
    static addClass(el: HTMLElement, className: string) {
        if (this.hasClass(el, className))
            return;

        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

    // IE8+
    // http://youmightnotneedjquery.com/
    static removeClass(el: HTMLElement, className: string) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    // IE8+
    // http://youmightnotneedjquery.com/
    static toggleClass(el: HTMLElement, className: string, force?: boolean) {
        if (force) {
            if (force.valueOf())
                this.addClass(el, className);
            else
                this.removeClass(el, className);
            return;
        }


        if (el.classList) {
            el.classList.toggle(className);
        } else {
            var classes = el.className.split(' ');
            var existingIndex = -1;
            for (var i = classes.length; i--;) {
                if (classes[i] === className)
                    existingIndex = i;
            }

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(className);

            el.className = classes.join(' ');
        }
    }

    static windowScrollTop(): number {
        return window.pageYOffset !== undefined ?
            window.pageYOffset :
            (<any>(document.documentElement || document.body.parentNode || document.body)).scrollTop;
    }

    static replaceWith(from: HTMLElement, to: HTMLElement) {
        const parent = from.parentElement;
        if (parent) parent.replaceChild(to, from);
    }

    static select(el: HTMLElement, selector: string, addBack: boolean = false): HTMLElement[] {
        const elements = el.querySelectorAll(selector);
        var result = Array.prototype.slice.call(elements) as Array<HTMLElement>;

        if (addBack && addBack.valueOf() && $dom.matches(el, selector)) {
            result.push(el);
        }
        return result;
    }

    static find(selector: string): HTMLElement {
        return document.querySelector(selector);
    }

    static first(el: HTMLElement, selector: string): HTMLElement {
        return el.querySelector(selector);
    }

    static clone(el: Element): HTMLElement {
        return el.cloneNode(true) as HTMLElement;
    }

    // IE9+
    // http://youmightnotneedjquery.com/
    static trigger(el: Element, ev: string, data: any) {
        if ((<any>window).CustomEvent) {
            var event = new CustomEvent(ev, { detail: data });
        } else {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(ev, true, true, data);
        }
        el.dispatchEvent(event);
    }

    static matches(el: Element, selector: string) {

        const matches =
            el.matches ||
            el['matchesSelector'] ||
            el.msMatchesSelector ||
            el['mozMatchesSelector'] ||
            el.webkitMatchesSelector ||
            el['oMatchesSelector'];

        return matches.call(el, selector);
    }

    static data<T>(el: HTMLElement, prop: string): T {
        var json = el.dataset[prop];
        var data: T = null;

        try {
            data = JSON.parse(json) as T;
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                json = json.replace(/'/g, '"');
                try {
                    data = JSON.parse(json) as T;
                } catch { }
            }
        }

        return data;
    }
}