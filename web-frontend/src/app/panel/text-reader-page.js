const Page = require("./page")
const TextBox = require("../../controls/text-box")
const Button = require("../../controls/button")
const Spinner = require("../../controls/spinner")

module.exports = class TextReaderPage extends Page {
    constructor(options) {
        super(options)

        this._textBox = new TextBox(
            {
                placeholder: "މިތާ ދިވެހިން ލިޔެލާ",
                type: 'textarea',
                grow: true,
                className: 'input-text'
            }
        )

        this._playButton = new Button(
            'ޕްލޭ',
            () => {
                this.textToSpeech(
                    ttsUrl,
                    this._textBox.value()
                )
            },
            {
                icon: 'volume-2',
                style: 'primary'
            }
        )

        this._spinner = new Spinner(
            {
                type: 'rotating'
            }
        )
    }

    async textToSpeech(url, text) {
        this._spinner.show()

        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"text": text})
        });

        if (!response.ok) {
            this._spinner.hideSoft();
            return;
        }

        const content = await response.json();

        if (!('audio_url' in content)) {
            this._spinner.hideSoft();
            return;
        }

        this.playAudio(content.audio_url);
        console.log("Success");

        this._spinner.hideSoft()

    }

    playAudio(url) {
        var audio = new Audio(url)
        audio.type = 'audio/wav'
        try {
            audio.play();
            console.log('Playing...');
        } catch (err) {
            console.log('Failed to play...' + err);
        }
    }

    createElement() {
        super.createElement();

        this.element.innerHTML = `<p>ތިރީގައިވާ ހުސްތަނުގައި ލިޔެލުމައްފަހު "ޕްލޭ" ބަޓން އަށް ފިތާލާ.</p>`

        this.element.appendChild(this._textBox.createElement())

        this._toolBarElement = document.createElement('div')
        this._toolBarElement.className = 'playback-toolbar'
        this.element.appendChild(this._toolBarElement)

        this._toolBarElement.appendChild(this._playButton.createElement())
        this._toolBarElement.appendChild(this._spinner.createElement())

        this._spinner.hideSoft()

        return this.element;
    }
}