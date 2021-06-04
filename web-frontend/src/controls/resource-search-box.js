//const SearchBox = require("./search-box");
const url = require("url");
const querystring = require('querystring');

const Control = require("./control");
const Popup = require("./popup");
const TextBox = require("./text-box");
const ResourceList = require("./resource-list");


module.exports = class ResourceSearchBox extends Control {
    constructor(idFunction, labelFunction, onSelectResult, options={}) {
        /*
         * idFunction(result) { return result.unique_id }
         * labelFunction(result) { return result.label }
         * onSelectResult(result) { do something using code }
         * 
         * Options:
         *  placeholder
         *  popupHeight
         *  cache
         *  displaySelected
         *  displayNull
         *  nullLabel
         *  resourceName = "path.to.resource"
         */
        super(options);
        this.idFunction = idFunction;
        this.labelFunction = labelFunction;
        this.onSelectResult = onSelectResult;
        this.resourceUrl = "";

        this._selelctedItem = null;

        this._textBox = new TextBox({
            placeholder: options.placeholder
        })

        this._popup = new Popup(
            this._textBox,
            {
                height: options.popupHeight
            }
        );

        this._listBox = new ResourceList(
            idFunction,
            labelFunction,
            (result) => {
                this._onSelectResult(result);
            },
            {
                cache: options.cache,
                displayNull: options.displayNull,
                nullLabel: options.nullLabel
            }
        )
    }

    focus() {
        this._textBox.focus()
    }

    value() {
        return this._selelctedItem;
    }

    setValue(value) {
        this._selelctedItem = value;
        this._displaySelected();
    }

    isBlank() {
        if (this._selelctedItem == null) {
            return true;
        }
        return false;
    }

    lock() {
        this._textBox.lock()
    }

    unlock() {
        this._textBox.unlock()
    }

    setResourceUrl(url) {
        this.resourceUrl = url;
    }

    _search() {
        var query = this._textBox.value();

        if  (query == "") {
            if (this.options.displaySelected == null) {
                this._hidePopup();
                return;
            }
        }

        this._showPopup();

        if (this.options.resourceName) {
            this.resourceUrl = connection.resourceFromName(this.options.resourceName)
        }

        var parts = url.parse(this.resourceUrl, true);
        parts.query.q = query
        delete parts.search;

        this._listBox.setResourceUrl(
            url.format(parts)
        )
    }

    _showPopup() {
        this._textBox.element.classList.add('flat-bottom');
        this._listBox.element.classList.add('flat-top');
        this._popup.popup()
    }

    _hidePopup() {
        this._textBox.element.classList.remove('flat-bottom');
        this._listBox.element.classList.remove('flat-top');
        this._popup.hide();
    }

    _onSelectResult(result) {
        this._hidePopup();
        this._selelctedItem = result;
        this._displaySelected();
        this.onSelectResult(this._selelctedItem);
    }

    _displaySelected() {
        
        if (this.options.displaySelected == true) {
            var value = this._selelctedItem;
            if (value) {
                this._textBox.setValue(this.labelFunction(this._selelctedItem).textContent)
                return
            }
            this._textBox.setValue('')
        }
    }

    createElement() {
        super.createElement();

        this.element.className = 'search-box';

        this.element.appendChild(
            this._textBox.createElement()
        );

        this.element.appendChild(
            this._popup.createElement()
        );

        this._popup.element.appendChild(
            this._listBox.createElement()
        );

        this._textBox.element.addEventListener('keydown', (event) => {
            if (event.code == 'ArrowUp') {
                event. preventDefault()
                if (!this._popup.isVisible()) {
                    this._listBox.clearFocus()
                    this._search()
                }
                this._listBox.focusUp()
            } else if (event.code == 'ArrowDown') {
                event. preventDefault()
                if (!this._popup.isVisible()) {
                    this._listBox.clearFocus()
                    this._search()
                }
                this._listBox.focusDown()
            }
        })

        
        this._textBox.element.addEventListener('keyup', (event) => {
            if (event.code == 'Enter') {
                event. preventDefault()
                this._listBox.selectFocused()
            } 
        });

        this._textBox.element.addEventListener('input', (event) => {
            this._search();
        })

        this._textBox.element.addEventListener('focusin', (event) => {
            if (this._textBox.isLocked()) {
                return
            }

            if (this.options.displaySelected) {
                //if (this._selelctedItem == null) {
                this._textBox.setValue("")
                //}
            }

            this._listBox.clearFocus()

            this._search();
        })

        var blurEvent = (ev) => {
            this._hidePopup();
            this._displaySelected();
        };

        this._textBox.element.addEventListener('blur', blurEvent)

        this._popup.element.addEventListener('mouseenter', (event) => {
            this._textBox.element.removeEventListener('blur', blurEvent);
        })

        this._popup.element.addEventListener('mouseleave', (event) => {
            this._textBox.element.addEventListener('blur', blurEvent)
        })

        this._displaySelected();

        return this.element;
    }
}