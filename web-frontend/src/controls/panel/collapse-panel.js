const Control = require("../control");
const Button = require("../button");


module.exports = class CollapsePanel extends Control {
    constructor (options={}) {
        super(options);

        this.btnExpand = new Button(
            '',
            (event) => {
                this._onToggleExpand()
            },
            {
                className: 'expand-button',
                style: 'clear',
                icon: 'arrow'
            }
        )

    }

    _onToggleExpand() {
        if (this.element.classList.contains('collapsed')) {
            this.element.classList.remove('collapsed')
            return
        }
        this.element.classList.add('collapsed')
    }

    collapse() {
        this.element.classList.add('collapsed')
    }

    expand() {
        this.element.classList.remove('collapsed')
    }

    setValue() {

    }

    setTitle(title) {
        this.titleElement.innerText = title
    }

    createElement() {
        super.createElement()

        this.element.classList.add('collapse-panel')

        this.headerElement = document.createElement('div')
        this.headerElement.className = 'header'
        this.element.appendChild(this.headerElement)

        this.headerElement.appendChild(this.btnExpand.createElement())

        this.titleElement = document.createElement('div')
        this.titleElement.className = 'title'
        if (this.options.title) {
            this.titleElement.innerText = this.options.title
        }
        this.headerElement.appendChild(this.titleElement)

        this.bodyElement = document.createElement('div')
        this.bodyElement.className = 'body'
        this.element.appendChild(this.bodyElement)

        return this.element
    }
}