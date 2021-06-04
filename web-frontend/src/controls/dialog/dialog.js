const createFocusTrap = require("focus-trap")
const Control = require("../control");
const Button = require("../button");


module.exports = class Dialog extends Control {
    constructor(options={}) {
        /* Options
         *  centered=false
         *  title="Title"
         *  noCloseButton=false
         *  noFooter=false
         */
        super(options);

        this.onCancel = null;

        this.headerElement = null;
        this.bodyElement = null;
        this.footerElement = null;
        this._titleElement = null;
        this._dialogElement = null;
        this._closeElement = null;

        this._closeButton = new Button(
            "Close",
            (event) => {
                this._onCancel()
            },
            {
                style: 'clear',
                icon: 'x',
                className: 'hide-label'
            }
        )

        this._title = new Control()
    }

    value() {
        return null;
    }

    show(onCancel) {
        this.onCancel = onCancel;

        document.body.appendChild(this.createElement());
        
        super.show();
        this.focusTrap.activate()
    }

    hide() {
        super.hide();
        this.focusTrap.deactivate()

        document.body.removeChild(this.element);
        this.headerElement = null;
        this.bodyElement = null;
        this.footerElement = null;
        this._titleElement = null;
        this._dialogElement = null;
        this._closeElement = null;
    }

    
    _onCancel(ev) {
        this.hide();
        this.onCancel();
    }


    setTitle(title) {
        this._title.setValue(title)
    }

    hideCloseButton() {
        this._closeButton.hide()
    }

    showCloseButton() {
        this._closeButton.show()
    }

    createHeaderElement() {
        let header = document.createElement('div');
        header.className = 'dialog-header';

        if (!this.options.noCloseButton) {
            header.appendChild(this._closeButton.createElement());
        }

        header.appendChild(this._title.createElement('h1'));
        
        return header;
    }

    createBodyElement() {
        let body = document.createElement('div');
        body.className = 'dialog-body';
        
        return body;
    }

    createFooterElement() {
        let footer = document.createElement('div');
        footer.className = 'dialog-footer';
        if (this.options.groupButtons) {
            footer.classList.add('button-group-row')
        }
        return footer
    }

    createElement() {
        super.createElement();

        this.focusTrap = createFocusTrap(this.element);

        if (this.options.centered == true){
            this.element.className = 'foreground-centered';
        } else {
            this.element.className = 'foreground';
        }

        this._dialogElement = document.createElement('div');
        this._dialogElement.className = 'dialog';
        this.element.appendChild(this._dialogElement);

        this._dialogElement.appendChild(this.createHeaderElement());
        
        this._dialogElement.appendChild(this.createBodyElement());

        if (!this.options.noFooter) {
            this._dialogElement.appendChild(this.createFooterElement());
        }

        super.hide();

        if (this.options.title) {
            this.setTitle(this.options.title)
        }

        return this.element;
    }

}