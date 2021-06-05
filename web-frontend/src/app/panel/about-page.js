const Page = require("./page")
const TextBox = require("../../controls/text-box")
const Button = require("../../controls/button")
const Spinner = require("../../controls/spinner")

module.exports = class AboutPage extends Page {
    createElement() {
        super.createElement();

        this.element.innerHTML = `<h1>މަޢުލޫމާތު</h1><p>އިތުރު މަޢުލޫމާތު.</p>`

        return this.element;
    }
}