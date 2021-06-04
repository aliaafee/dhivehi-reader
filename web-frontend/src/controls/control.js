
module.exports = class Control {
    constructor(options = {}) {
        /* Options
         *  widht, height =  css size
         *  className = class name of the element
         *  id = html id of element
         *  tabIndex = the tab index
         */
        this.element = null;
        this.options = options;

        this._display = null
    }

    focus() {
        this.element.focus();
    }

    removeElement() {
        if (this.element == null) {
            return
        }
        parent = this.element.parentElement

        if (parent == null) {
            return
        }

        parent.removeChild(this.element);
    }

    createElement(tagName) {
        if (!tagName) {
            tagName = 'div'
        }

        //Create the element
        this.element = document.createElement(tagName);

        //Add styles
        //this.element.style.display = "flex";
        if (this.options.id) {
            this.element.id = this.options.id
        }
        if (this.options.className) {
            this.element.classList.add(this.options.className)
        }
        if (this.options.tabIndex) {
            this.element.tabIndex = this.options.tabIndex
        }

        this.element.style.userSelect = "none";
        this.element.style.width = this.options.width;
        this.element.style.height = this.options.height;

        //Attache events

        return this.element;
    }

    hideSoft() {
        this.element.style.visibility = 'hidden';
    }

    hide() {
        this._display = this.element.style.display
        this.element.style.display = "none";
    }

    isVisible() {
        if (this.element.style.display == "none") {
            return false
        }
        if (this.element.style.visibility == 'hidden') {
            return false
        }
        return true
    }

    isInView(elem, parent) {
        if (!elem) {
            elem = this.element
        }

        if (!elem) {
            return false
        }

        if (!parent) {
            parent = elem.parentElement
        }

        var rect = elem.getBoundingClientRect();
        var parentRect = parent.getBoundingClientRect();
        //const windowHeight = (window.innerHeight || parent.clientHeight);

        var windowHeight = Math.min(window.innerHeight, parent.clientHeight);

        var elemTop = rect.top - parentRect.top

        const vertInView = (elemTop + rect.height <= windowHeight) && ((elemTop) >= 0);

        return (vertInView);
    }

    lock() {
        this.element.classList.add('locked')
    }

    unlock() {
        this.element.classList.remove('locked')
    }

    setValue(value) {
        if (!this.element) {
            return
        }
        this.element.innerText = value;
    }

    show() {
        if (this._display) {
            if (this._display != 'none') {
                this.element.style.display = this._display;
            }
            this.element.style.display = ''
        } else {
            this.element.style.display = '';
        }
        
        this.element.style.visibility = '';
    }
}
