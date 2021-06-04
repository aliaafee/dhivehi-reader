const Control = require('../../controls/control');
const Button = require('../../controls/button');
const HomePanel = require('./home-panel');


module.exports = class MainPanel extends Control {
    constructor(options={}) {
        super(options);

        this._titleText = options.titleText
        this._subTitleText = options.subTitleText

        this._homePanel = new HomePanel()

        this._menuItems = [];
        this._sidebarItems = [];
        
        this._userButton = new Button(
            'Username',
            (event) => {
                console.log("Open User Dialog");
            },
            {
                icon: 'user'
            }
        )
        this._logoutButton = new Button(
            'Logout',
            (event) => {
                console.log("Logout")
            },
            {
                icon: 'log-out'
            }
        )

        this.addMenuSpacer();
        //this.addMenuItem(this._userButton)
        //this.addMenuItem(this._logoutButton)

        /*
        this.addSidebarItem(
            new Button(
                'Home',
                (event) => {
                    console.log('Home')
                },
                {
                    icon: 'home'
                }
            )
        )
        
        
        this.addSidebarItem(
            new Button(
                'Button 1',
                (event) => {
                    console.log('Button 1')
                },
                {
                    icon: 'tool'
                }
            )
        )
        this.addSidebarItem(
            new Button(
                'Button 2', 
                (event) => {
                    console.log('Button 2')
                },
                {
                    icon: 'pie-chart'
                }
            )
        )
        this.addSidebarItem(
            new Button(
                'Button 3', 
                (event) => {
                    console.log('Button 3')
                },
                {
                    icon: 'map-pin'
                }
            )
        )
        

        this.addSidebarSpacer()
        this.addSidebarItem(
            new Button(
                'Settings',
                () => {
                    console.log('Settings')
                },
                {
                    icon: 'settings'
                }
            )
        )
        */
    }

    addMenuItem(item) {
        this._menuItems.push(item);
    }

    addMenuSpacer() {
        this._menuItems.push('_spacer');
    }

    addSidebarItem(item) {
        this._sidebarItems.push(item);
    }

    
    addSidebarSpacer() {
        this._sidebarItems.push('_spacer');
    }

    _createMenuBarElement() {
        this._menuBarElement = document.createElement('div')
        this._menuBarElement.className = 'menu-bar';

        var titleElem = document.createElement('div');
        titleElem.className = 'menu-bar-title';
        titleElem.innerText = this._titleText
        this._menuBarElement.appendChild(titleElem)
        
        var subTitleElem = document.createElement('div');
        subTitleElem.className = 'menu-bar-subtitle';
        subTitleElem.innerText = this._subTitleText
        this._menuBarElement.appendChild(subTitleElem)
        

        this._menuItems.forEach((item) => {
            if (item == '_spacer') {
                var elem = document.createElement('div');
                elem.className = 'menu-bar-spacer';
                this._menuBarElement.appendChild(elem);
                return;
            }
            var elem = item.createElement();
            elem.classList.add('menu-bar-item');
            this._menuBarElement.appendChild(elem)
        })

        return this._menuBarElement;
    }

    _createSideBarElement() {
        this._sideBarElement = document.createElement('div')
        this._sideBarElement.className = 'side-bar';

        this._sidebarItems.forEach((item) => {
            if (item == '_spacer') {
                var elem = document.createElement('div');
                elem.className = 'side-bar-spacer';
                this._sideBarElement.appendChild(elem);
                return;
            }
            var elem = item.createElement();
            elem.classList.add('side-bar-item');
            this._sideBarElement.appendChild(elem)
        })

        return this._sideBarElement;
    }

    createElement() {
        super.createElement();

        //this._userButton.label = getUserName();

        this.element.className = 'main-panel';

        this.element.appendChild(this._createMenuBarElement())

        var bodyElem = document.createElement('div');
        bodyElem.className = 'main-panel-body';
        this.element.appendChild(bodyElem);

        bodyElem.appendChild(this._createSideBarElement())

        this._mainElement = document.createElement('div')
        this._mainElement.className = 'main-content';
        bodyElem.appendChild(this._mainElement)

        this._mainElement.appendChild(this._homePanel.createElement());        

        return this.element;
    }
}