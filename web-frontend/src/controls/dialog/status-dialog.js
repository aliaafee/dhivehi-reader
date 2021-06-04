const Dialog = require("./dialog");
const Button = require("../button");
const Spinner = require("../spinner")
const Control = require("../control")


module.exports = class StatusDialog extends Dialog {
    constructor(options={}) {
        options.noCloseButton = true
        options.centered = true
        super(
            {
                noCloseButton: true,
                centered: true,
                noFooter: true,
                ...options
            }
        )

        this.btnOk = new Button(
            options.okLabel != null ? options.okLabel : 'Ok',
            (ev) => {
                this._onOk(ev);
            },
            {
                style: 'clear',
                icon: 'check',
                className: 'hide-label'
            }
        );

        this._afterDismiss = null

        this.spinner = new Spinner()
        this.message = new Control(
            {
                className: 'message'
            }
        )
    }

    setMessage(message) {
        this.message.setValue(message)
    }

    showSpinner() {
        this.spinner.show()
    }

    hideSpinner() {
        this.spinner.hideSoft()
    }

    showDismiss(afterDismiss) {
        this._afterDismiss = afterDismiss
        this.btnOk.show()
        this.hideSpinner()
    }

    _onOk() {
        if (this._afterDismiss) {
            this._afterDismiss()
        }
        this.hide()
    }

    maximize() {
        this.element.className = "foreground"
    }

    show(title, message, dissmissable=true) {
        super.show(() => {})

        this.setTitle(title)
        this.setMessage(message)

        if (!dissmissable) {
            this.btnOk.hide()
        } else{
            this.hideSpinner()
        }
    }

    createBodyElement() {
        let body = super.createBodyElement()

        body.appendChild(this.spinner.createElement())
        body.appendChild(this.message.createElement())

        return body
    }

    createHeaderElement() {
        let header = super.createHeaderElement()

        header.appendChild(this.btnOk.createElement())

        return header
    }

    createElement() {
        let elem = super.createElement()

        elem.className = 'foreground-centered-small'

        return elem
    }
}