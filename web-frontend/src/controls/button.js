const feather = require('feather-icons')

const Control = require("./control");

module.exports = class Button extends Control {
    constructor(label, onClick, options) {
        /* Options
         *  style = <blan>|primary|clear
         *  icon = feather icon name
         */
        super(options);
        this.label = label;
        this.onClick = onClick;
    }

    lock() {
        this.element.disabled = true
    }

    unlock() {
        this.element.disabled = false
    }

    setLabel(label) {
        this.label = label
        if (this.labelElement) {
            this.labelElement.innerText = label
        }
    }

    setTitle(title) {
        this.element.setAttribute('title', title)
    }

    createElement() {
        let elem = super.createElement('button');
        
        this.element.style.minWidth = this.options.width;
        this.element.style.minHeight = this.options.height;

        if (this.options.style) {
            this.element.classList.add(this.options.style)
        }

        if (this.options.className) {
            this.element.classList.add(this.options.className)
        }

        this._displayElement = document.createElement('span')
        this.element.appendChild(this._displayElement)

        if (this.options.icon) {
            if (this.options.icon == 'arrow') {
                this.iconElement = document.createElement('span')
                this.iconElement.className = 'arrow'
                this._displayElement.appendChild(this.iconElement)
            } else {
                this.iconElement = document.createElement('template')
                this.iconElement.innerHTML = feather.icons[this.options.icon].toSvg(
                    {
                        class: 'icon',
                        width: '',
                        height: ''
                    }
                )
                this._displayElement.appendChild(this.iconElement.content.firstChild)
            }
        }

        this.labelElement = document.createElement('span')
        this.labelElement.className = 'label'
        this._displayElement.appendChild(this.labelElement)
        
        if (this.options.title) {
            this.element.setAttribute('title', this.options.title)
        } else {
            this.element.setAttribute('title', this.label)
        }
        this.labelElement.innerText = this.label

        this.element.addEventListener('click', (ev) => {
            ev.preventDefault();
            this.onClick(ev);
        })

        return this.element
    }

}
