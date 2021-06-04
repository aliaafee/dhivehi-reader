const Control = require("./control");

module.exports = class SpinnerForground extends Control {
    constructor(options) {
        super(options);
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'foreground';

        var spinner = document.createElement('div');
        spinner.className = 'spinner';

        this.element.appendChild(spinner);

        return(this.element);
    }
}
