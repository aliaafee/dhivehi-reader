const Control = require("../control");


module.exports = class Form extends Control {
    constructor(options={}) {
        /*Options
         *  labelSize=in css units
         *  labelTop=false
         *  //flexDirection='column|row'
         *  title='Heading title'
         *  compact=false
         *  hideTitle=false
         */
        super(options);

        this._fields = [];
        this._buttons = [];
        this._fieldNames = [];

        this._title = new Control();
    }

    addField(field) {
        if (this.options.labelSize != null) {
            field.options.labelSize = this.options.labelSize;
        }
        if (this.options.labelTop != null) {
            field.options.labelTop = this.options.labelTop;
        }

        this._fields.push(field);
        this._fieldNames.push(field.name);
    }

    addButton(button) {
        this._buttons.push(button)
    }

    setValue(value) {
        if (!value) {
            this.clear()
            return
        }
        //Value is dictionary with fieldName: value
        for (var i = 0; i < this._fieldNames.length; i++) {
            this._fields[i].setValue(
                value[this._fieldNames[i]]
            );
        }
    }

    value() {
        //Returns a dictionary with fieldName: value
        var result = {};
        for (var i = 0; i < this._fieldNames.length; i++) {
            result[this._fieldNames[i]] = this._fields[i].value();
        }
        return result;
    }

    isBlank() {
        var blank = true;
        for (var i = 0; i < this._fieldNames.length; i++) {
            if (!this._fields[i].isBlank()) {
                blank = false
                return blank
            }
        }
        return blank;
    }

    getFieldByName(fieldName) {
        return this._fields[this._fieldNames.findIndex((value) => { return value == fieldName;})];
    }

    setFieldLabel(fieldName, label) {
        this.getFieldByName(fieldName).setLabel(label);
    }

    setFieldValue(fieldName, value) {
        this.getFieldByName(fieldName).setValue(value);
    }

    fieldValue(fieldName) {
        return this.getFieldByName(fieldName).value();
    }

    hideField(fieldName) {
        this.getFieldByName(fieldName).hide();
    }

    isValid() {
        var isValid = true

        this._fields.forEach((field) => {
            if (field.isValid() == false) {
                isValid = false
                return isValid
            }
        });

        return isValid;
    }

    validate() {
        var isValid = true;

        this._fields.forEach((field) => {
            if (field.validate() == false) {
                isValid = false;
            }
        });

        return isValid;
    }

    clear() {
        this._fields.forEach((field) => {
            field.setValue(null)
        })
    }

    lock() {
        this._fields.forEach((field) => {
            field.lock();
        });
        this.clearValidation()
    }

    unlock() {
        this._fields.forEach((field) => {
            field.unlock();
        });
        this.clearValidation()
    }

    clearValidation() {
        this._fields.forEach((field) => {
            field.markValid();
        });
    }

    markInvalidFields(invalid_fields) {
        for (const [field_name, message] of Object.entries(invalid_fields)) {
            this.getFieldByName(field_name).markInvalid(message)
        }
    }

    createElement(elem='div') {
        super.createElement(elem);

        this.element.classList.add("form")

        if (this.options.compact) {
            this.element.classList.add("compact")
        }

        if (this.options.title && !this.options.hideTitle) {
            this.element.appendChild(this._title.createElement('h1'))
            this._title.setValue(this.options.title)
        }

        this._fields.forEach((field) => {
            this.element.appendChild(field.createElement());
        })

        this._buttons.forEach((button) => {
            this.element.appendChild(button.createElement())
        })

        return this.element;
    }

}