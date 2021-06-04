const ListBox = require('./list-box');


module.exports = class RadioListBox extends ListBox {
    constructor(idFunction, labelFunction, onSelectItem, options) {
        /* idFunction(result) { return result.unique_id }
         * labelFunction(result) { return result.label as element node }
         * onResultClicked(result) { do something using result }
         * 
         * Options:
         *  height
         *  onLink
         */
        super(idFunction, labelFunction, onSelectItem, options);

        this._onItemClicked = (event) => {
            this.clearSelection();

            this._selectedElement = event.target.parentElement;

            this._highlightSelection();
            this._onSelectItem(event);
        }
    }

    _highlightSelection() {
        //this._selectedElement.className = 'selected';
        this._selectedElement.firstChild.checked = true;
    }

    setSelection(itemId, scroll = true) {
        if (itemId == null || itemId == '') {
            this.clearSelection();
            return;
        }
        for (var i = 0; i < this._itemIds.length; i++) {
            if (this._itemIds[i] == itemId) {
                this.clearSelection()

                this._selectedElement = this._itemElements[i];
                this._selectedItem = this.data[i];
                
                this._highlightSelection();

                if (scroll) {
                    this._selectedElement.scrollIntoView();
                }
            }
        }
    }

    clearSelection() {
        if (this._selectedElement != null) {
            this._selectedElement.className = null;
            this._selectedElement.firstChild.checked = false;
        }
        this._selectedElement = null;

        this._selectedItem = null;
    }

    _createListItem(itemid, label) {
        var item = document.createElement('li');
        item.setAttribute('item-id', itemid);

        var radio = document.createElement('input');
        radio.type = 'radio';
        item.appendChild(radio);

        var labelElement = document.createElement('div');
        labelElement.appendChild(label)
        item.appendChild(labelElement);
        

        radio.addEventListener('click', this._onItemClicked);

        return item;
    }

    displayData() {
        super.displayData();

        if (this.options.onLink != null) {
            var links = this.element.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
                links[i].addEventListener('click', this.options.onLink)
            }
        }
    }
}