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

    textToSpeech(url, text) {
        this._spinner.show()
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json);
                this.playAudio(json.audio_url);
            }
            this._spinner.hideSoft()
        };
        var data = JSON.stringify({"text": text});
        xhr.send(data);
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