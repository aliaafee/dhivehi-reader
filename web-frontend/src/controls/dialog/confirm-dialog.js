const Dialog = require("./dialog");
const Button = require("../button");
const Control = require("../control")

module.exports = class ConfirmDialog extends Dialog {
    constructor(options={}) {
        super(
            {
                centered: true,
                noFooter: true,
                ...options
            }
        )

        this.btnOk = new Button(
            options.okLabel != null ? options.okLabel : 'Ok',
            (ev) => {
                this._onOk(ev);
                this.hide();
            },
            {
                style: 'clear',
                icon: 'check',
                className: 'hide-label'
            }
        );

        this.message = new Control(
            {
                className: 'message'
            }
        )
    }

    show(title, message, onOk, onCancel) {
        super.show(onCancel)
        this._onOk = onOk

        this.setTitle(title)
        this.message.setValue(message)
    }

    createHeaderElement() {
        let header = super.createHeaderElement();

        header.appendChild(this.btnOk.createElement())

        return header
    }

    createBodyElement() {
        let body = super.createBodyElement()

        body.appendChild(this.message.createElement())

        return body
    }

    createElement() {
        let elem = super.createElement()

        elem.className = 'foreground-centered-small'

        return elem
    }
}