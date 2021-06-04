const WizardPage = require('./wizard-page')
const Form = require('../../controls/form/form')

module.exports = class WizardForm extends WizardPage {
    constructor(form, options) {
        super(options)

        if (!form) {
            this.form = new Form(
                {
                    labelTop: true,
                }
            )
            return
        }

        this.form = form
    }

    validate() {
        return this.form.validate()
    }

    value() {
        return this.form.value()
    }

    setValue(value) {
        this.form.setValue(value)
    }

    show() {
        super.show()
        //Need to call unlock on form for proper sizing or
        //growing of text boxes
        this.form.unlock()
    }

    createElement() {
        super.createElement()

        this.element.appendChild(this.form.createElement())

        return this.element;
    }
}