const Page = require("./page")
const Button = require("../../controls/button")
const Spinner = require("../../controls/spinner")
const WebsiteReaderForm = require("../form/website-reader-form")


module.exports = class WebsiteReaderPage extends Page {
    constructor(options) {
        super(options)

        this.form = new WebsiteReaderForm()

        this._playButton = new Button(
            'ޕްލޭ',
            () => {
                this.webToSpeech(
                    webTtsUrl,
                    this.form.value().url
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

    webToSpeech(url, targetUrl) {
        const urlResult = new URL(webTtsUrl)
        Object.entries(this.form.value()).forEach(
            ([name, value]) => {
                urlResult.searchParams.append(name, value)
            }
        )
        console.log(urlResult.href)

        this._spinner.show()
        var xhr = new XMLHttpRequest();
        xhr.open("GET", urlResult.href, true);
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json);
                this.playAudio(json.audio_url);
                this.displayArticle(json.article);
            }
            this._spinner.hideSoft()
        };
        //var data = JSON.stringify({"text": text});
        xhr.send();
        
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

    displayArticle(article) {
        this._displayElement.innerHTML = ""
        console.log("Display")
        
        if (article.title) {
            var el = document.createElement('h1')
            el.innerText = article.title
            this._displayElement.appendChild(el)
        }

        if (article.time) {
            var el = document.createElement('p')
            el.innerText = article.time
            this._displayElement.appendChild(el)
        }

        if (article.author) {
            var el = document.createElement('p')
            el.innerText = article.author
            this._displayElement.appendChild(el)
        }

        if (article.content) {
            article.content.forEach(
                (para) => {
                    var el = document.createElement('p')
                    el.innerText = para
                    this._displayElement.appendChild(el)
                }
            )
            
        }
    }

    createElement() {
        super.createElement()

        this.element.innerHTML = `<p>ތިރީގައިވާ ހުސްތަނުގައި ވެބް ޕޭޖް ގެ އެޑްރެސް ލިޔެލުމައްފަހު "ޕްލޭ" ބަޓަން އަށް ފިތާލާ.</p>`

        this._toolBarElement = document.createElement('div')
        this._toolBarElement.className = 'playback-toolbar'
        this.element.appendChild(this._toolBarElement)

        this._toolBarElement.appendChild(this._playButton.createElement())
        this._toolBarElement.appendChild(this._spinner.createElement())

        this.element.appendChild(this.form.createElement())

        this._displayElement = document.createElement('div')
        this._displayElement.className = 'article-display'
        this.element.append(this._displayElement)

        this._spinner.hideSoft()

        return this.element
    }
}