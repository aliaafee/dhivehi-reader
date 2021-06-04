const TextBox = require("../text-box");
const Field = require("./field");
const Control = require("../control");


module.exports = class TextField extends Field {
    constructor(name, options = {}) {
        super(name, options);

        this._textBox = new TextBox({
            placeholder: options.placeholder,
            type: options.type,
            rows: options.rows,
            resize: options.resize,
            grow: options.grow,
            maxGrow: options.maxGrow
        });

        this._lockedView = new Control({
            className: 'locked-text-box'
        })
    }

    focus() {
        this._textBox.focus();
    }

    isBlank() {
        return this._textBox.isBlank();
    }

    value() {
        return this._textBox.value();
    }

    displayValue() {
        return this.value();
    }

    setValue(value) {
        super.setValue(value);
        this._textBox.setValue(value);
        this._lockedView.setValue(this.displayValue());
    }

    lock() {
        super.lock();
        this._textBox.hide()
        this._lockedView.show()
        this._lockedView.setValue(this.displayValue())
    }

    unlock() {
        super.unlock();
        this._textBox.show()
        this._lockedView.hide()
    }

    createFieldBody() {
        let body = super.createFieldBody();

        body.append(
            this._textBox.createElement(),
            this._lockedView.createElement()
        )

        this._lockedView.hide();

        return body
    }
}
