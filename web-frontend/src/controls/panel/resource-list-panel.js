const querystring = require('querystring');
const Button = require("../../controls/button");
const CollapsePanel = require("../../controls/panel/collapse-panel");
const Spinner = require("../../controls/spinner");

module.exports = class ResourceListPanel extends CollapsePanel {
    constructor (formList, resourceUrlKey, options={}) {
        super(options)

        this.spinner = new Spinner()

        this.listForm = formList
        this.resourceUrlKey = resourceUrlKey

        this.btnEdit = new Button(
            'Add',
            (event) => {
                this._onEdit()
            },
            {
                icon: 'plus',
                style: 'clear'
            }
        )

        this.btnCancel = new Button(
            'Cancel',
            (event) => {
                this._onCancel()
            },
            {
                icon: 'x',
                style: 'clear'
            }
        )
    }

    _onEdit() {
        this.unlock()
    }

    _onCancel() {
        this.lock()
    }

    transient() {
        this.btnCancel.hide()
        this.btnEdit.hide()
    }

    lock() {
        this.listForm.lock()
        this.btnEdit.show()
        this.btnCancel.hide()
    }

    unlock() {
        this.listForm.unlock()
        this.btnEdit.hide()
        this.btnCancel.show()
    }

    setValue(value) {
        this.lock()

        if (value ? value[this.resourceUrlKey] : true) {
            this.listForm.resourceUrl = value[this.resourceUrlKey]
            this.setResourceUrl(
                value[this.resourceUrlKey] + '?' + querystring.stringify({
                    'type': this.listForm.options.resourceTypes.join(',')
                })
            )
            return
        }

        if (value ? !value[this.listForm.fieldName] : false) {
            return
        }

        this.listForm.setValue(value)
    }

    value() {
        return this.listForm.value()
    }

    setResourceUrl(url) {
        this.spinner.show()

        connection.get(
            url,
            (response) => {
                let result = {}
                result[this.listForm.fieldName] = response.items
                this.listForm.setValue(result)
                //TODO: Manage Pagination Here
            },
            (error) => {
                this.listForm.clear()
                if (error.status == 404) {
                    return
                }
                this.statusElem.innerText = "Error Loading Encounters"
            },
            () => {
                this.spinner.hide()
            }
        )
    }

    createElement() {
        let elem = super.createElement()

        elem.classList.add('resource-panel')

        super.createElement()

        this.element.classList.add('resource-panel')

        this.toolBarElement = document.createElement('div');
        this.toolBarElement.className = 'toolbar'
        this.headerElement.appendChild(this.toolBarElement)

        this.toolBarElement.appendChild(this.btnEdit.createElement())
        this.toolBarElement.appendChild(this.btnCancel.createElement())

        this.statusElem = document.createElement('div')
        this.statusElem.className = 'resource-status'

        this.toolBarElement.prepend(this.statusElem)

        this.bodyElement.appendChild(this.spinner.createElement())

        this.bodyElement.appendChild(this.listForm.createElement())

        this.listForm.lock()
        this.btnEdit.show()
        this.btnCancel.hide()
        this.spinner.hideSoft()

        return this.element
    }
}