const ResourceList = require('./resource-list');


module.exports = class ResourceRadioList extends ResourceList {
    constructor(idFunction, labelFunction, onSelectItem, options) {
        /* idFunction(result) { return result.unique_id }
         * labelFunction(result) { return result.label }
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

    clearSelection() {
        if (this._selectedElement != null) {
            this._selectedElement.className = null;
            this._selectedElement.firstChild.checked = false;
        }
        this._selectedElement = null;

        this._selectedItem = null;
    }

    _createListItem(itemid, labelElement) {
        var item = document.createElement('li');
        item.setAttribute('item-id', itemid);

        var radio = document.createElement('input');
        radio.type = 'radio';
        //radio.tabIndex = -1;
        item.appendChild(radio);

        item.appendChild(labelElement);

        radio.addEventListener('change', this._onItemClicked);

        return item;
    }

    _appendData(data) {
        super._appendData(data);

        if (this.options.onLink != null) {
            var links = this.element.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
                links[i].addEventListener('click', this.options.onLink)
                links[i].tabIndex = -1
            }
        }
    }
}