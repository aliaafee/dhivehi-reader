//const Control = require("../control");
const Button = require("../button");
const Spinner = require("../spinner");
const CollapsePanel = require("./collapse-panel");

module.exports = class ResourcePanel extends CollapsePanel {
    constructor (form, onSaved, options={}) {
        super(options);

        this.form = form
        this.onSaved = onSaved

        this._data = null

        this.spinner = new Spinner()

        this.btnEdit = new Button(
            'Edit',
            (event) => {
                this._onEdit()
            },
            {
                icon: 'edit-3',
                style: 'clear'
            }
        )

        this.btnSave = new Button(
            'Save',
            (event) => {
                this._onSave()
            },
            {
                icon: 'check',
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
        this.form.setValue(this._data)
        this.lock()
    }

    _createNew() {
        if (!this.options.newUrl) {
            this.statusElem.innerText = "New URL not specified"
        }

        var _data = this.form.value();
        _data['type'] = this.options.type;

        this.transient();
        this.spinner.show()
        this.statusElem.innerText = "Creating New..."
        connection.post(
            this.options.newUrl,
            _data,
            (response) => {
                if (response.error) {
                    this.unlock()
                    this.statusElem.innerText = response.error
                    if (response.invalid_fields) {
                        this.statusElem.innerText = "Marked fields are not valid"
                        this.form.markInvalidFields(response.invalid_fields)
                    } else {
                        this.statusElem.innerText = response.message
                    }
                    return
                }
                this.statusElem.innerText = "Saved"
                this.setValue(response)
                if (this.onSaved) {
                    this.onSaved(response)
                }
                this.lock()
            },
            (error) => {
                this.statusElem.innerText = `Could Not Create New`
                this.unlock()
            },
            () => {
                this.spinner.hideSoft()
            }
        )
    }

    _onSave() {
        if (!this.form.validate()) {
            this.statusElem.innerText = "Marked fields are not valid"
            return
        }

        if (this._data ? !this._data.url : true ) {
            this._createNew();
            return
        }

        var _data = this.form.value();

        this.transient()
        this.spinner.show()
        this.statusElem.innerText = "Saving.."
        connection.post(
            this._data.url,
            _data,
            (response) => {
                console.log(response)
                if (response.error) {
                    this.unlock()
                    this.statusElem.innerText = response.error
                    if (response.invalid_fields) {
                        this.statusElem.innerText = "Marked fields are not valid"
                        this.form.markInvalidFields(response.invalid_fields)
                    } else {
                        this.statusElem.innerText = response.message
                    }
                    return
                }
                this.statusElem.innerText = "Saved"
                this.setValue(response)
                if (this.onSaved) {
                    this.onSaved(response)
                }
                this.lock()
            },
            (error) => {
                this.statusElem.innerText = `Could Not Save`
                this.unlock()
            },
            () => {
                this.spinner.hideSoft()
            }
        )
    }

    transient() {
        this.form.lock()
        this.btnSave.hide()
        this.btnCancel.hide()
        this.btnEdit.hide()
    }

    lock() {
        this.form.lock()
        if ((this._data ? !this._data.url : true) && !this.options.newUrl) {
            this.btnEdit.hide()
            this.btnSave.hide()
            this.btnCancel.hide()
            return
        }
        this.btnEdit.show()
        this.btnSave.hide()
        this.btnCancel.hide()
    }

    unlock() {
        this.form.unlock()
        if ((this._data ? !this._data.url : true ) && !this.options.newUrl ) {
            this.btnEdit.hide()
            this.btnSave.hide()
            this.btnCancel.hide()
            return
        }
        this.btnEdit.hide()
        this.btnSave.show()
        this.btnCancel.show()
    }

    setValue(value) {
        this._data = value

        this.form.setValue(this._data)
        this.statusElem.innerText = ""

        if (this._data ? !this._data.url : true ) {
            this.unlock()
            return
        }

        this.lock()
    }

    value() {
        if (this._data) {
            return this._data
        }
        return this.form.value()
    }

    validate() {
        return this.form.validate();
    }

    createElement() {
        super.createElement()

        this.element.classList.add('resource-panel')

        this.toolBarElement = document.createElement('div');
        this.toolBarElement.className = 'toolbar'
        this.headerElement.appendChild(this.toolBarElement)

        this.toolBarElement.appendChild(this.btnEdit.createElement())
        this.toolBarElement.appendChild(this.btnSave.createElement())
        this.toolBarElement.appendChild(this.btnCancel.createElement())

        this.statusElem = document.createElement('div')
        this.statusElem.className = 'resource-status'

        this.toolBarElement.prepend(this.statusElem)

        this.bodyElement.appendChild(this.spinner.createElement())
        this.bodyElement.appendChild(this.form.createElement())

        this.form.lock()
        this.btnEdit.show()
        this.btnSave.hide()
        this.btnCancel.hide()
        this.spinner.hideSoft()

        return this.element
    }
}