const Control = require("./control");
const TextBox = require("./text-box");
const ListBox = require("./list-box");
const Popup = require("./popup");

module.exports = class SearchBox extends Control {
    constructor(searchFunction, idFunction, labelFunction, onSelectResult, options = {}) {
        /* searchFunction(search_str, on_done) { call on_done(data) when done  }
         * idFunction(result) { return result.unique_id }
         * labelFunction(result) { return result.label }
         * onSelectResult(result) { do something using code }
         * 
         * Options:
         *  placeholder
         *  popupHeight
         */
        super(options);
        this.searchFunction = searchFunction;
        this.idFunction = idFunction;
        this.labelFunction = labelFunction;
        this.onSelectResult = onSelectResult;

        this._textBox = new TextBox({
            placeholder: options.placeholder
        })

        this._popup = new Popup(this._textBox);

        this._listBox = new ListBox(
            idFunction,
            labelFunction,
            (result) => {
                this._onSelectResult(result);
            },
            {
                height: options.popupHeight
            }
        )
    }

    _search() {
        var query = this._textBox.value();
        if (query == "") {
            this._hidePopup();
            return;
        }
        this.searchFunction(
            query,
            (data) => {
                this._listBox.setData(data);
                this._showPopup();
            }
        );
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
        this.onSelectResult(result);
    }


    createElement() {
        super.createElement();

        this.element.className = 'search-box';

        this.element.appendChild(
            this._textBox.createElement()
        );
        //this._textBox.element.style.flexGrow = 1;

        this.element.appendChild(
            this._popup.createElement()
        );

        this._popup.element.appendChild(
            this._listBox.createElement()
        );

        //this._listBox.element.style.flexGrow = 1;

        this._textBox.element.addEventListener('keyup', (ev) => {
            if (ev.code == 'ArrowUp') {
                this._selectUp();
            } else if (ev.code == 'ArrowDown') {
                this._selectDown();
            } else {
                this._search();
            }
        });

        this._textBox.element.addEventListener('focusin', (ev) => {
            this._search();
            this._textBox.select();
        })

        var blurEvent = (ev) => {
            this._hidePopup();
        };

        this._textBox.element.addEventListener('blur', blurEvent)

        this._popup.element.addEventListener('mouseenter', (ev) => {
            this._textBox.element.removeEventListener('blur', blurEvent);
        })

        this._popup.element.addEventListener('mouseleave', (ev) => {
            this._textBox.element.addEventListener('blur', blurEvent)
        })

        return this.element;
    }
}
