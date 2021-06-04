const MainPanel = require('./app/panel/main-panel');

mainPanel = new MainPanel(
    {
        titleText: 'ދިވެހި އަޑު',
        subTitleText: ""
    }
)

showMainWindow = () => {
    requestAnimationFrame(() => {
        document.body.appendChild(mainPanel.createElement());
    })
}

showMainWindow()