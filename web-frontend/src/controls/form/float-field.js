const TextField = require("./text-field");


module.exports = class FloatField extends TextField {
    constructor(name, options = {}) {
        options.type = 'number';
        super(name, options);
    }

    value() {
        var value = super.value();
        if (value == "") {
            return null
        }
        return value;
    }

    setValue(value) {
        if (!value) {
            super.setValue("")
            return
        }
        super.setValue(value)
    }

    isValid() {
        if (!super.isValid()) {
            return false;
        }
        if (isNaN(this.value())) {
            return false;
        }
        return true;
    }
}