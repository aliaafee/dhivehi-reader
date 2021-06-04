const Control = require('../control')

module.exports = class WizardPage extends Control {
    constructor(options) {
        super(options)
    }

    validate() {
        return true
    }

    value() {
        return;
    }

    setValue(value) {

    }

    createElement() {
        super.createElement()

        this.element.classList.add('wizard-page')
        this.element.classList.add('scrolled')

        if (this.options.title) {
            var title = document.createElement('h1')
            title.innerText = this.options.title
            this.element.appendChild(title)
        }

        return this.element
    }
}