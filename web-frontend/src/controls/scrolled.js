const Control = require("./control");

module.exports = class Scrolled extends Control {
    constructor(options) {
        super(options);
    }

    scrollTo(position) {
        this.element.scrollTo(0, position);
    }

    scrollToElement(element, testVisibility=true) {
        if (testVisibility) {
            if (this.isInView(element, this.element)) {
                return
            }
        }
        this.scrollTo(0)
        //var pos = element.offsetTop - this.element.offsetTop
        var pos = element.offsetTop
        this.scrollTo(pos)
    }

    createElement() {
        super.createElement();

        this.element.classList.add('scrolled');

        return this.element;
    }
}
