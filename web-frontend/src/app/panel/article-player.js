const Control = require("../../controls/control")


class ArticleSection extends Control {
    constructor(content, options={}) {
        /* Options
         *  type= h1, h2, p, ... etc (vald tag name)
         *  content = {text: '', audio_base64wav: '', transcript: ''}
         */
        super(options)

        this.content = content
    }

    play() {
        console.log("Playing")
        //this._audio.fastSeek(0)
        this._audio.load()
        this._audio.play()
    }

    pause() {
        this._audio.pause()
    }

    createElement() {
        if (this.options.type) {
            super.createElement(this.options.type)
        } else {
            super.createElement()
        }

        this._span = document.createElement('span')
        this.element.appendChild(this._span)
        if (this.content.text) {
            this._span.innerText = this.content.text
        }
        this._span.addEventListener('click', () => { this.play() })

        this._audio = new Audio(this.content.audio_base64wav)
        this._audio.addEventListener('play', () => { this._span.classList.add('playing')})
        this._audio.addEventListener('pause', () => { this._span.classList.remove('playing')})
        this._audio.addEventListener('ended', () => { this._span.classList.remove('playing')})

        return this.element
    }
}


module.exports = class ArticlePlayer extends Control {
    constructor(options={}) {
        options.className = 'article-player'
        super(options)

        this._sections = []
    }

    set(article) {
        this._sections = []
        this.element.innerHTML = ""

        if (article.title) {
            var section = new ArticleSection(article.title, {type: 'h1'})
            this._sections.push(section)
            this.element.appendChild(section.createElement())
        }

        if (article.time) {
            var section = new ArticleSection(article.time, {type: 'p'})
            this._sections.push(section)
            this.element.appendChild(section.createElement())
        }

        if (article.author) {
            var section = new ArticleSection(article.author, {type: 'p'})
            this._sections.push(section)
            this.element.appendChild(section.createElement())
        }

        if (article.content) {
            article.content.forEach(
                (para) => {
                    var section = new ArticleSection(para, {type: 'p'})
                    this._sections.push(section)
                    this.element.appendChild(section.createElement())
                }
            )
            
        }
    }

    createElement() {
        super.createElement()

        return this.element
    }
}