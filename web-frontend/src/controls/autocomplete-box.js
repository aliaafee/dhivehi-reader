const url = require("url");
const Control = require("./control");
const TextBox = require("./text-box")

module.exports = class AutocompleteBox extends Control {
    constructor(idFunction, labelFunction, onSelectResult, options = {}) {
        /* searchFunction(search_str, on_done) { call on_done(data) when done  }
         * idFunction(result) { return result.unique_id }
         * labelFunction(result) { return result.label }
         * onSelectResult(result) { do something using code }
         * 
         * Options:
         *  placeholder
         *  resourceName = "path.to.resource" in index
         */
        super(options)

        this.idFunction = idFunction;
        this.labelFunction = labelFunction;
        this.onSelectResult = onSelectResult;
        this.resourceUrl = "";

        this._textBox = new TextBox({
            placeholder: options.placeholder
        })

        this._shadowTextBox = new Control({
            
        })

        this._focusedValue = null;
        this._selectedValue = null;
    }

    setResourceUrl(url) {
        this.resourceUrl = url;
    }

    _setFocusedValue(value) {
        this._focusedValue = value;
        if (!this._focusedValue) {
            this._shadowTextBox.setValue("")
            return
        }
        let input = this._textBox.value()
        let display = `${input}${this.labelFunction(value).substr(input.length)}`

        this._shadowTextBox.setValue(display)
    }


    _selectFocusedValue() {
        if (!this._focusedValue) {
            return
        }
        this._selectedValue = this._focusedValue;
        this._shadowTextBox.setValue("")
        this._textBox.setValue(this.labelFunction(this._selectedValue))
    }

    _search() {
        var query = this._textBox.value();

        this._selectedValue = null
        this._setFocusedValue(null)

        if (query == "") { 
            return
        }

        if (this.options.resourceName) {
            this.resourceUrl = connection.resourceFromName(this.options.resourceName)
        }

        console.log(this.resourceUrl)

        var parts = url.parse(this.resourceUrl, true);
        parts.query.s = query
        parts.query.per_page = 1
        delete parts.search;

        let targetUrl = url.format(parts)

        connection.get(
            targetUrl,
            (result) => {
                this._setFocusedValue(result.items[0])
                console.log(result.items[0])
            },
            (error) => {
                if (error.status == 404) {
                    console.log("Not Found")
                    return
                }
                console.log(`Error getting ${targetUrl}`)
            }
        )
    }

    setValue(value) {
        if (!value) {
            this._selectedValue = null
            this._focusedValue = null
            this._textBox.setValue("")
            this._shadowTextBox.setValue("")
            return
        }
        this._selectedValue = value;
        this._textBox.setValue(this.labelFunction(this._selectedValue))
    }

    value() {
        if (this._selectedValue) {
            return this._selectedValue
        }

        if (!this._textBox.value()) {
            return null
        }

        return {
            'name': this._textBox.value()
        }
    }

    focus() {
        this._textBox.focus()
    }

    createElement() {
        super.createElement();
        
        this.element.classList.add('search-box')
        this.element.classList.add('autocomplete-box')

        this.element.appendChild(
            this._textBox.createElement()
        )

        this.element.appendChild(
            this._shadowTextBox.createElement()
        )
        this._shadowTextBox.element.classList.add("shadow-text-box")

        this._textBox.element.addEventListener('keyup', (event) => {
            if (event.code == 'Escape') {
                this._setFocusedValue(null)
            } else if (event.code == 'Enter') {
                this._selectFocusedValue()
            } else {
                this._search();
            }
        })

        this._textBox.element.addEventListener('focusin', (event) => {
            this._shadowTextBox.show()
        })

        this._textBox.element.addEventListener('blur', (event) => {
            this._shadowTextBox.hide()
        })

        this._shadowTextBox.hide()

        return this.element
    }
}