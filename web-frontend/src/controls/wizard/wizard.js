//const Control = require("./control");
const Dialog = require('../dialog/dialog');
const Button = require('../button')
const StatusDialog = require('../dialog/status-dialog')

module.exports = class Wizard extends Dialog {
    constructor(options) {
        super(
            {
                noFooter: true,
                ...options
            }
        )

        this.pages = []

        this.afterSave =

        this._currentPage = 0

        this.btnBack = new Button(
            'Back',
            (event) => {
                this._onBack(event)
            },
            {
                style: 'clear',
                icon: 'arrow-left',
                className: 'hide-label'
            }
        )

        this.btnNext = new Button(
            'Next',
            (event) => {
                this._onNext(event)
            },
            {
                style: 'clear',
                icon: 'arrow-right',
                className: 'hide-icon'
            }
        )

        this.btnSave = new Button(
            'Save',
            (event) => {
                this._onSave(event)
            },
            {
                style: 'clear',
                icon: 'check',
                className: 'hide-icon'
            }
        )
    }

    value() {
        var result = {}
        this.pages.forEach((page) => {
            var page_value = page.value()
            if (page_value) {
                result = Object.assign(result,page_value)
            }
        })
        return result
    }

    show(afterSave, onCancel) {
        this.afterSave = afterSave
        super.show(onCancel);
    }

    _onNext() {
        var currentPage = this.getCurrentPage()

        if (!currentPage.validate()) {
            var statusDialog = new StatusDialog()
            statusDialog.show(
                'Invalid Fields',
                'Some fields contain invalid values'
            )
            return false
        }

        this.gotoNextPage()
    }

    _onBack() {
        this.gotoPreviousPage()
    }

    _onSave() {
        /*
        var currentPage = this.getCurrentPage()

        if (!currentPage.validate()) {
            console.log("Invalid input")
            return false
        }*/

        this.onSave(this.value())
    }

    onSave(data) {
        this.afterSave(data)
    }

    addPage(page) {
        this.pages.push(page);
    }

    gotoPage(page) {
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].hide()
        }

        this._currentPage = page
        this.pages[this._currentPage].show(this)

        if (this._currentPage == 0) {
            this.btnBack.hide()
            this.showCloseButton()
        } else {
            this.btnBack.show()
            this.hideCloseButton()
        }

        if (this._currentPage == this.pages.length - 1) {
            this.btnNext.hide()
            this.btnSave.show()
        } else {
            this.btnNext.show()
            this.btnSave.hide()
        }
    }

    gotoNextPage() {
        if (this._currentPage >= this.pages.length - 1) {
            return 
        }

        this.gotoPage(this._currentPage + 1)
    }

    gotoPreviousPage() {
        if (this._currentPage < 1) {
            return 
        }

        this.gotoPage(this._currentPage - 1)
    }

    getCurrentPage() {
        return this.pages[this._currentPage]
    }

    createBodyElement() {
        let body = super.createBodyElement()

        this.pages.forEach((page) => {
            body.appendChild(page.createElement());
        })

        return body
    }

    createHeaderElement() {
        let header = super.createHeaderElement()

        header.prepend(this.btnBack.createElement())
        header.appendChild(this.btnNext.createElement())
        header.appendChild(this.btnSave.createElement())

        this.btnSave.hide()
        this.btnBack.hide()

        return header;
    }

    createElement() {
        let elem = super.createElement()

        elem.classList.add("wizard")

        this.gotoPage(0)

        return this.element
    }
}