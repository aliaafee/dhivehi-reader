const Form = require("./form");
const Control = require("../control")
const Button = require("../button")
const ResourcePanel = require("../panel/resource-panel")
const ConfirmDialog = require("../../controls/dialog/confirm-dialog")


class SubFormPanel extends ResourcePanel {
    constructor (form, onSaved, onDelete, options={}) {
        form.options.hideTitle = true;
        options.title = form.options.title;

        super(form, onSaved, options);

        this.onDelete = onDelete

        this._isDeleted = false;

        this.btnDelete = new Button(
            'Delete',
            () => {
                this._onDelete()
            },
            {
                icon: 'trash',
                style: 'clear',
                className: 'alert'
            }
        )
    }

    transient() {
        super.transient();
        this.btnDelete.hide();
    }

    lock() {
        super.lock();
        this.btnDelete.hide()
    }

    unlock() {
        super.unlock();
        this.btnDelete.show()
    }

    _delete() {
        if (this._data ? !this._data.url : true ) {
            this.hide();
            this._isDeleted = true;
            return
        }

        this.spinner.show()
        this.transient()
        
        connection.delete(
            this._data.url,
            (response) => {
                this.lock()
                this.hide()
                this.onDelete()
            },
            (error) => {
                this.statusElem.innerText = `Could Not Delete`
                this.unlock()
            },
            () => {
                this.spinner.hideSoft()
            }
        )
    }

    _onDelete() {
        var confirm = new ConfirmDialog()

        confirm.show(
            "Delete Item",
            "Are you sure you want to delete this item? This operation is not reversible",
            () => {
                this._delete()
            },
            () => {}
        )
    }

    value() {
        if (this._isDeleted) {
            return null
        }

        if (this._data) {
            return this._data
        }

        return {
            type: this.options.type,
            ...this.form.value()
        }
    }

    validate() {
        if (this._isDeleted) {
            return true
        }
        return super.validate()
    }

    createElement() {
        let elem = super.createElement();

        this.toolBarElement.prepend(this.btnDelete.createElement())
        this.btnDelete.hide()

        return elem
    }
}


class FormTypesToolbar extends Control {
    constructor(formTypes, onAddNewItem, options={}) {
        super(options)
        /* formTypes = [{name, label}, ...]
         * onAddNewItem(type_name_of_item)
         */

        this.formTypes = formTypes
        this.onAddNewItem = onAddNewItem
    }

    createElement() {
        let elem = super.createElement();

        elem.classList.add('form-types')
        elem.classList.add('toolbar')

        elem.append(
            ...this.formTypes.map(
                ({name, label}) => {
                    let btn = new Button(
                        label,
                        () => {
                            this.onAddNewItem(name)
                        },
                        {
                            icon: 'plus',
                            style: 'clear'
                        }
                    )
                    return btn.createElement()
                }
            )
        )

        return elem
    }
}


module.exports = class ListForm extends Form {
    constructor(fieldName, onSaveSubForm, onDeleteSubForm, options={}) {
        super(options)
        /* Options
         *  resourceTypes = ['name', 'name', ..]
         *  onSaveSubForm(item)
         *  onDeleteSubForm(item)
         */

        this.resourceUrl = null
        this.fieldName = fieldName
        this.onSaveSubForm = onSaveSubForm
        this.onDeleteSubForm = onDeleteSubForm

        this.toolbar = new FormTypesToolbar(
            this.getFormTypes(),
            (typeName) => {
                this._onAddNewItem(typeName)
            }
        )

        this._subFormPanels = []
        
    }

    lock() {
        this.toolbar.hide()
    }

    lockAll() {
        this.lock()
        this._subFormPanels.forEach((subFormPanel) => {
            subFormPanel.lock()
        })
    }

    unlock() {
        this.toolbar.show()
    }

    unlockAll() {
        this.unlock()
        this._subFormPanels.forEach((subFormPanel) => {
            subFormPanel.unlock()
        })
    }

    setValue(value) {
        this.clear()

        if (!value) {
            return
        }

        if (!value[this.fieldName]) {
            return
        }

        this._appendData(value[this.fieldName])
    }

    value() {
        let result = {}
        result[this.fieldName] = this._subFormPanels
                                    .map((panel) => panel.value())
                                    .filter((value) => value)
        return result
    }

    validate() {
        return this._subFormPanels.map(
            (panel) => panel.validate()
        ).reduce(
            (prev, curr) => {
                if (!curr) {
                    return false
                }
                return prev
            },
            true
        )
    }

    getFormTypes() {
        return [
            {
                name: 'name',
                label: 'Label'
            }
        ]
    }

    generateSubForm(name) {
        return new Form();
    }

    clear() {
        while (this.formListElement.firstChild) {
            this.formListElement.firstChild.remove()
        }
        this._subFormPanels = []
    }

    _appendData(data) {
        if (!data) {
            return
        }

        let subFormPanels = data.map(
            (item) => {
                if (!this.options.resourceTypes.includes(item.type)) {
                    return null
                }
                let panel = new SubFormPanel(
                    this.generateSubForm(item.type),
                    (item) => {
                        this.onSaveSubForm(item)
                    },
                    (item) => {
                        this.onSaveSubForm(item)
                    },
                    {
                        type: item.type
                    }
                )
                panel.createElement();
                panel.setValue(item)
                return panel
            }
        ).filter((i) => i)

        this.formListElement.append(
            ...subFormPanels.map(
                (subForm) => subForm.element
            )
        )

        this._subFormPanels.push(...subFormPanels)
    }

    _onAddNewItem(typeName) {
        let newPanel = new SubFormPanel(
            this.generateSubForm(typeName),
            (item) => {
                this.onSaveSubForm(item)
            },
            (item) => {
                this.onSaveSubForm(item)
            },
            {
                type: typeName,
                newUrl: this.resourceUrl
            }
        )

        this._subFormPanels.push(newPanel)
        this.formListElement.prepend(newPanel.createElement())

        newPanel.unlock()
    }

    createElement() {
        let elem = super.createElement()

        elem.classList.add('form-list')

        elem.appendChild(this.toolbar.createElement())

        this.formListElement = document.createElement('div')
        this.formListElement.className = 'subform-list'
        elem.appendChild(this.formListElement)

        return elem
    }
}