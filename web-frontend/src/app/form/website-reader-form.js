const Form = require("../../controls/form/form");
const TextField = require("../../controls/form/text-field")


module.exports = class WebsiteReaderForm extends Form {
    constructor(options={}) {
        super(options)

        this.addField(
            new TextField(
                'u',
                {
                    placeholder: "Webpage URL",
                    className: "url"
                }
            )
        )
    }
}