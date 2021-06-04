const Select = require("../select");
const Field = require("./field");


module.exports = class SelectField extends Field {
    constructor(name, idFunction, labelFunction, options = {}) {
        /*opions
         *  data=the options to display
         *  onlyId=value returned/set is only id
         */
        super(name, options);

        this._select = new Select(
            idFunction,
            labelFunction,
            {
                placeholder: options.placeholder,
                data: options.data,
                onlyId: options.onlyId
            }
        );
    }

    focus() {
        this._select.focus();
    }

    isBlank() {
        return this._select.isBlank();
    }

    value() {
        return this._select.value();
    }

    setValue(value) {
        super.setValue(value)
        this._select.setValue(value);
    }

    setData(data) {
        this._select.setData(data);
    }

    clear() {
        this._select.clear();
    }

    lock() {
        super.lock()
        this._select.lock();
    }

    unlock() {
        super.unlock()
        this._select.unlock();
    }

    createFieldBody() {
        let body = super.createFieldBody();

        body.appendChild(
            this._select.createElement()
        );

        return body
    }

}