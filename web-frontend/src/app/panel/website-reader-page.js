const Page = require("./page")
const Button = require("../../controls/button")
const Spinner = require("../../controls/spinner")
const WebsiteReaderForm = require("../form/website-reader-form")
const ArticlePlayer = require("./article-player")


module.exports = class WebsiteReaderPage extends Page {
    constructor(options) {
        super(options)

        this._player = new ArticlePlayer(
            () => {
                this._stopButton.show()
            }
        )

        this._url = ""

        this.form = new WebsiteReaderForm()

        this._playButton = new Button(
            'ޕްލޭ',
            () => {
                this.webToSpeech()
            },
            {
                icon: 'volume-2',
                style: 'primary'
            }
        )

        this._stopButton = new Button(
            'ހުއްޓާލާ',
            () => {
                this._player.stop()
                this._stopButton.hide()
            },
            {
                icon: 'square'
            }
        )

        this._spinner = new Spinner(
            {
                type: 'rotating'
            }
        )

        
    }

    generateUrl() {
        const urlResult = new URL(webTtsUrl)
        Object.entries(this.form.value()).forEach(
            ([name, value]) => {
                urlResult.searchParams.append(name, value)
            }
        );
        return urlResult.href;
    }

    async webToSpeech() {
        this._spinner.show()

        const url = this.generateUrl();

        console.log(url);

        const response = await fetch(url);

        if (!response.ok) {
            this._spinner.hideSoft();
            return;
        }

        const content = await response.json();

        if (!('article' in content)) {
            this._spinner.hideSoft();
            return;
        }

        this.displayArticle(content.article);
        console.log("Success");

        this._spinner.hideSoft()
    }

    displayArticle(article) {
        this._player.show()
        this._player.set(article)
        this._player.play()
        this._stopButton.show()
    }

    createElement() {
        super.createElement()

        this.element.innerHTML = `<p>ތިރީގައިވާ ހުސްތަނުގައި ވެބް ޕޭޖް ގެ އެޑްރެސް ލިޔެލުމައްފަހު "ޕްލޭ" ބަޓަން އަށް ފިތާލާ.</p>`

        this.element.appendChild(this.form.createElement())

        this._toolBarElement = document.createElement('div')
        this._toolBarElement.className = 'playback-toolbar'
        this.element.appendChild(this._toolBarElement)

        this._toolBarElement.appendChild(this._playButton.createElement())
        this._toolBarElement.appendChild(this._stopButton.createElement())
        this._toolBarElement.appendChild(this._spinner.createElement())

        this.element.appendChild(this._player.createElement())

        this._player.hide()

        this._spinner.hideSoft()
        this._stopButton.hide()

        return this.element
    }
}