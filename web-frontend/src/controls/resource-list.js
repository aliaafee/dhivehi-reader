const ListBox = require("./list-box")
const Spinner = require("./spinner")

module.exports = class ResourceList extends ListBox {
    constructor(idFunction, labelFunction, onSelectItem, options) {
        /* idFunction(result) { return result.unique_id }
         * labelFunction(result) { return result.label }
         * onResultClicked(result) { do something using result }
         * autoLoadNext = false
         * cache = false
         * displayNull
         *  nullLabel
         * 
         */
        super(idFunction, labelFunction, onSelectItem, options);

        //this.options.cache = true;

        this.spinner = new Spinner();

        this.resource_data = {}

        this._discardNext = true;

        this._cache = {}
    }

    setResourceUrl(url, onDone) {
        if (this.options.cache) {
            if (this._cache[url]) {
                this.resource_data = this._cache[url];
                this.setData(this.resource_data.items);
                if (onDone) {
                    onDone();
                }
                return;
            }
        }

        this._discardNext = true;
        this.spinner.show();
        this._listElement.style.display = 'none';
        connection.get(
            url,
            data => {
                if (this.options.cache) {
                    this._cache[url] = data;
                }
                this.resource_data = data;
                this.setData(this.resource_data.items);
                if (onDone) {
                    onDone();
                }
            },
            (error) => {
                console.log(error);
                this._clear();
                this.resource_data = {};
                if (this.options.displayNull) {
                    this._createNullElement()
                }
                if (error.status == 404) {
                    this._createFailedElement('Not Found...')
                } else {
                    this._createFailedElement()
                }
            },
            () => {
                this.spinner.hide();
                this._listElement.style.display = 'block';
            }
        )
    }

    selectFocused() {
        if (!this._focusedElement) {
            return
        }

        var next_url = this._focusedElement.getAttribute('next-url');

        if (!next_url) {
            super.selectFocused()
        }

        this.focusUp()
        this._onLoadNextClicked()
    }

    _onLoadNextClicked() {
        if (this._nextElement != null) {
            this._listElement.removeChild(this._nextElement);
        }
        this._nextElement = null;

        var url = this.resource_data.next;

        if (this.options.cache) {
            if (this._cache[url]) {
                this.resource_data = this._cache[url];
                this._appendData(this.resource_data.items)
                return;
            }
        }

        this._discardNext = false;
        this.spinner.show();
        
        connection.get(
            url,
            data => {
                if (this.options.cache) {
                    this._cache[url] = data;
                }
                if (this._discardNext == false) {
                    this.resource_data = data;
                    this._appendData(this.resource_data.items)
                }
            },
            (error) => {
                if (this._discardNext == false) {
                    //console.log(error);
                    //this.resource_data = {};
                    //this._clear();
                    if (error.status == 404) {
                        this._createFailedElement('Not Found...')
                    } else{
                        this._createNextElement("Failed to load, retry...")
                        this.options.autoLoadNext = false;
                    }
                }
                
            },
            () => {
                this.spinner.hide();
            }
        )
    }

    _nextElemVisible() {
        if (this._nextElement == null) {
            return false;
        }

        var rect = this._nextElement.getBoundingClientRect();
        
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);

        return (vertInView);
    }

    _autoLoadNext() {
        if (!this.options.autoLoadNext) {
            return
        }

        if (!this._nextElemVisible()) {
            return;
        }

        this._onLoadNextClicked();
    }

    _clear() {
        super._clear();

        this._nextElement = null;
        this._failedElement = null;
    }

    _createNextElement(label="Load More...") {
        if (this._nextElement != null) {
            this._listElement.removeChild(this._nextElement);
            this._nextElement = null;
        }
        if (this.resource_data.next) {
            this._nextElement = document.createElement('li');
            this._nextElement.setAttribute('next-url', this.resource_data.next);
            this._nextElement.className = 'button'
            this._nextElement.innerText = label;
            this._nextElement.addEventListener('click', (event) => { 
                this._onLoadNextClicked(event) 
            } )
            this._listElement.appendChild(this._nextElement);
        }
    }

    _createNullElement(label) {
        if (!label) {
            if (this.options.nullLabel && !label) {
                label = this.options.nullLabel
            } else {
                label = "--"
            }
        }
        
        this._nullElement = document.createElement('li')
        this._nullElement.setAttribute('item-id', '');
        this._nullElement.innerText = label
        this._nullElement.addEventListener('click', this._onItemClicked)
        this._listElement.prepend(this._nullElement)
    }

    setData(data) {
        super.setData(data)
        if (this.options.displayNull) {
            this._createNullElement()
        }
    }

    _appendData(data) {
        super._appendData(data)
    
        this._createNextElement()
    }


    _createFailedElement(label="Failed to Load") {
        if (this._failedElement != null) {
            this._listElement.removeChild(this._failedElement)
        }
        this._failedElement = document.createElement('li')
        this._failedElement.className = 'button';
        this._failedElement.innerText = label;
        this._listElement.appendChild(this._failedElement);
    }


    createElement() {
        super.createElement();

        //this.element.style.flexDirection = 'column';
        //this._listElement.style.flexGrow = 0;

        this.element.appendChild(this.spinner.createElement());
        //this.spinner.hide();

        if (this.options.autoLoadNext) {
            this.element.addEventListener('scroll', () => {
                this._autoLoadNext();
            })
        }

        this.spinner.hide()

        return this.element;
    }
}