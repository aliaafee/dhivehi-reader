const Control = require("../../controls/control")

module.exports = class Page extends Control {
    constructor(options) {
        super(options)
    }

    createElement() {
        super.createElement();

        this.element.classList.add('page')

        return this.element;
    }
}