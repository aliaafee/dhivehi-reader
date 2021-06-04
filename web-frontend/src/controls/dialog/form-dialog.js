const Dialog = require("./dialog");
const Button = require("../button");


module.exports = class FormDialog extends Dialog {
    constructor(form, options={}) {
        super(
            {
                noFooter: true,
                ...options
            }
        )

        this.form = form;

        this.onOk = null;

        this.btnOk = new Button(
            options.okLabel ? options.okLabel : 'Ok',
            (ev) => {
                this._onOk(ev);
            },
            {
                style: 'clear',
                icon: options.okIcon ? options.okIcon : 'check',
                className: 'hide-icon'
            }
        );
    }

    value() {
        return this.form.value();
    }

    show(onOk, onCancel) {
        this.onOk = onOk
        super.show(onCancel)
    }

    _onOk(ev) {
        if (this.form.validate() == false) {
            return;
        }
        this.onOk()
        //super._onOk(ev);
    }

    createBodyElement() {
        let body = super.createBodyElement();

        body.className = 'dialog-body-padded';
        body.appendChild(this.form.createElement('form'))

        return body
    }

    createHeaderElement() {
        let header = super.createHeaderElement();

        header.appendChild(this.btnOk.createElement());

        return header
    }
}