const Control = require("./control");

module.exports = class Spinner extends Control {
    constructor(options) {
        /*Options
         *  type = <bar> | rotating | growing
         *
         * 
         */
        super(options);

        this._spinnerElement = null;
        this._labelElement = null;

        this._activeJobs = 0
    }

    setLabel(label) {
        this._labelElement.innerText = label;
    }

    reset() {
        this._activeJobs = 0
    }

    show() {
        this._activeJobs += 1
        super.show();
    }

    hide() {
        this._activeJobs -= 1
        if (this._activeJobs < 1) {
            this._activeJobs = 0
            super.hide()
        }
    }

    hideSoft() {
        this._activeJobs -= 1
        if (this._activeJobs < 1) {
            this._activeJobs = 0
            super.hideSoft()
        }
    }


    createElement() {
        super.createElement();

        var spinnerClass = 'spinner';
        var spinnerContainerClass = 'spinner-container';

        if (this.options.type == 'rotating') {
            spinnerClass = 'spinner-rotating'
            spinnerContainerClass = 'spinner-rotating-container'
        }

        this.element.className = spinnerContainerClass

        this._spinnerElement = document.createElement('div');
        this._spinnerElement.className = spinnerClass;
        this.element.appendChild(this._spinnerElement);

        this._labelElement = document.createElement('div');
        this._labelElement.className = 'spinner-label';
        this.element.appendChild(this._labelElement);

        return this.element;
    }
}