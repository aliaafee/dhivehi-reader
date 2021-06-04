const Scrolled = require("./scrolled");

module.exports = class ListBox extends Scrolled {
    constructor(idFunction, labelFunction, onSelectItem, options) {
        /* idFunction(result) { return result.unique_id }
         * labelFunction(result) { return result.label as element }
         * onResultClicked(result) { do something using result }
         * 
         */
        super(options);

        this.idFunction = idFunction;
        this.labelFunction = labelFunction;
        this.onSelectItem = onSelectItem;

        this.data = [];
        this._itemIds = [];
        //this._itemElements = [];

        this._listDataItems = {};
        this._listChildElems = {};

        this._listElement = null;

        this._selectedItem = null;
        this._selectedElement = null;

        this._focusedElement = null;

        this._locked = false;

        this._onItemClicked = (event) => {
            if (this._locked) {
                return;
            }
            this.clearSelection();

            this._selectedElement = event.currentTarget;
            
            this._highlightSelection();
            this._onSelectItem(event);
        }
    }

    lock() {
        this._locked = true;
        this.element.classList.add('locked');
    }

    unlock() {
        this._locked = false;
        this.element.classList.remove('locked')
    }

    _createListItem(itemid, labelElement) {
        var item = document.createElement('li');
        item.setAttribute('item-id', itemid);

        item.appendChild(labelElement)

        item.addEventListener('click', this._onItemClicked);

        return item;
    }

    _highlightSelection() {
        this._selectedElement.className = 'selected';
    }

    _onSelectItem(event) {
        this._selectedItem = null;
        this._selectedItemId = this._selectedElement.getAttribute('item-id');

        if (this._selectedItemId == null) {
            this._selectedItem = null
        } else {
            this._selectedItem = this._listDataItems[this._selectedItemId];
        }
        
        this.onSelectItem(this._selectedItem);
    }

    value() {
        return this._selectedItem;
    }

    setSelection(itemId, scroll=true) {
        this.clearSelection();
        if (itemId == null || itemId == '') {
            if (this.options.displayNull) {
                this._selectedItem = this._listElement.firstChild
                this._highlightSelection()
                if (scroll) {
                    this.scrollToElement(this._selectedElement)
                }
            }
            return;
        }
        
        this._selectedItemId = itemId

        this._selectedItem = this._listDataItems[itemId]
        
        this._selectedElement = this._listChildElems[itemId];
        this._highlightSelection();
        if (scroll) {
            this.scrollToElement(this._selectedElement);
        }
    }

    selectFocused() {
        if (!this._focusedElement) {
            return
        }

        var item_id = this._focusedElement.getAttribute('item-id');

        if (!item_id) {
            if (this.options.displayNull) {
                this.clearSelection()
                this.onSelectItem(null)
            }
            return
        }

        this.setSelection(item_id)
        this.onSelectItem(this._selectedItem);
    }

    focusUp() {
        var elem = null;

        if (!this._focusedElement) {
            elem = this._listElement.lastChild
        } else {
            elem = this._focusedElement.previousSibling
        }

        this.clearFocus()

        if (!elem) {
            return
        }

        this._focusedElement = elem
        this._focusedElement.classList.add("focused")
        this.scrollToElement(this._focusedElement)
    }

    focusDown() {
        var elem = null;

        if (!this._focusedElement) {
            elem = this._listElement.firstChild
        } else {
            elem = this._focusedElement.nextSibling
        }

        this.clearFocus()

        if (!elem) {
            return
        }

        this._focusedElement = elem
        this._focusedElement.classList.add("focused")
        this.scrollToElement(this._focusedElement)
    }

    clearFocus() {
        if (this._focusedElement != null) {
            this._focusedElement.classList.remove("focused")
        }
        this._focusedElement = null
    }

    clearSelection() {
        if (this._selectedElement != null) {
            this._selectedElement.className = '';
        }
        this._selectedElement = null;

        this._selectedItemId = null
        this._selectedItem = null;
    }

    _clear() {
        this.clearFocus()
        
        while (this._listElement.firstChild) {
            this._listElement.firstChild.remove();
        }

        this._listChildElems = {}
        this._listDataItems = {}
        this._data = null;
        //this._itemIds = [];
    }

    _appendData(data) {
        if (this.data == null) {
            this.data = data;
        } else {
            this.data = this.data.concat(data);
        }

        data.forEach((item) => {
            var item_id = this.idFunction(item)
            
            //this._itemIds.push(item_id);

            this._listDataItems[item_id] = item
            
            this._listChildElems[item_id] = this._createListItem(
                item_id,
                this.labelFunction(item)
            );

            this._listElement.appendChild(this._listChildElems[item_id]);
        })
    }

    setData(data) {
        this._clear();
        this._appendData(data);
    }

    /*
    appendData(data) {
        this._appendData()
        return
        if (!this.data) {
            this.data = data
        } else {
            this.data = this.data.concat(data);
        }
        this.displayData(true);
    }*/
    /*
    displayData(noScroll) {
        this._clear();
        
        this._itemIds = [];
        this._itemElements = [];
        this.data.forEach((item) => {
            var item_id = this.idFunction(item);

            this._itemIds.push(item_id);

            var elem = this._createListItem(
                item_id,
                this.labelFunction(item)
            );

            this._listElement.appendChild(elem);
            this._itemElements.push(elem);
        })

        if (!noScroll) {
            this.element.scrollTop = 0;
        }       
    }*/

    createElement() {
        super.createElement();

        this.element.classList.add('list-box');
        this.element.style.display = 'block'
        
        this._listElement =  document.createElement('ul');
        //this._listElement.style.display = 'block'
        this.element.appendChild(this._listElement);

        return this.element;
    }
}