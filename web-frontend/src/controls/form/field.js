
const Control = require("../control");

module.exports = class Field extends Control {
    constructor(name, options = {}) {
        /*Options
         *  label=""
         *  labelSize=in css units
         *  labelTop=false
         *  required=true|false
         *  invalidFeedback=""
         *  helpText=""
         *  placeholder=""
         *  narrow=false
         */
        super(options);
        this.name = name;
        //this.label = label;

        this._label = new Control(
            {
                width: this.options.labelSize
            }
        );

        this._helpText = new Control(
            {
                className:'help-text'
            }
        );

        this._invalidFeedback = new Control(
            {
                className:'invalid-feedback'
            }
        );


        this._locked = false;
    }

    value() {
        return;
    }

    setValue(value) {
        if (this._locked) {
            if (!value) {
                this.hide()
                return
            }
            this.show()
        }
    }

    setLabel(text) {
        this.options.label = text
        if (this.labelElement != null) {
            this.labelElement.innerText = text;
        }
    }

    setData(data) {
        //Expects a dictionary with key equal to name
        this.setValue(
            data[this.name]
        );
    }

    isBlank() {
        return false;
    }

    isValid() {
        if (this.options.required == true) {
            if (this.isBlank()) {
                return false;
            }
        }
        return true;
    }

    validate() {
        this.markValid();

        var isValid = this.isValid();
        if (!isValid) {
            this.markInvalid();
        }

        return isValid;
    }

    markInvalid(message) {
        this.element.classList.add('invalid');
        if (message) {
            this.setInvalidFeedback(message)
        }
    }

    markValid() {
        this.element.classList.remove('invalid');
    }

    lock() {
        this._locked = true;
        if (this.isBlank()) {
            this.hide()
        }
        this.element.classList.add('locked')
    }

    unlock() {
        this._locked = false;
        this.element.style.display = 'flex';
        this.element.classList.remove('locked')
    }

    setHelpText(message) {
        if (!message) {
            this._helpText.setValue("")
            return
        }
        this._helpText.setValue(message)
    }

    setInvalidFeedback(message) {
        if (!message) {
            this._invalidFeedback.setValue("")
            return
        }
        this._invalidFeedback.setValue(
            message
        )
    }

    createFieldBody() {
        let body = document.createElement('div');
        
        body.className = 'input-placeholder'

        return body
    }

    createElement() {
        super.createElement()

        this.element.classList.add('field');

        if (this.options.narrow) {
            this.element.classList.add('narrow')
        }

        let labelElement = null
        if (this.options.label != null) {
            labelElement = this._label.createElement('label');
            this._label.setValue(this.options.label + (this.options.required ? "*" : ""))
            labelElement.style.width = this.options.labelSize;
        }
        
        this._content = document.createElement('div');
        this._content.className = 'content';

        if (this.options.label == null) {
            this.element.appendChild(this._content);
        } else if (this.options.labelTop == true) {
            this._content.appendChild(labelElement);
            this.element.appendChild(this._content);
        } else {
            this.element.appendChild(labelElement);
            this.element.appendChild(this._content);
        }

        this._content.append(
            this.createFieldBody(),
            this._helpText.createElement(),
            this._invalidFeedback.createElement()
        )

        this.setHelpText(this.options.helpText);
        this.setInvalidFeedback(this.options.invalidFeedback);

        return this.element
    }
}
