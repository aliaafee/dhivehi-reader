const Control = require("../../controls/control")


class ArticleSection extends Control {
    constructor(index, content, onClick, options={}) {
        /* Options
         *  type= h1, h2, p, ... etc (vald tag name)
         *  content = {text: '', audio_base64wav: '', transcript: ''}
         */
        super(options)

        this.index = index
        this.content = content
        this.onClick = onClick
    }

    highlight() {
        this._span.classList.add('playing')
        //this.scrollIntoView()
    }

    unhighlight() {
        this._span.classList.remove('playing')
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
        this._span.addEventListener('click', () => { this.onClick(this) })

        return this.element
    }
}


module.exports = class ArticlePlayer extends Control {
    constructor(onPlay, options={}) {
        options.className = 'article-player'
        super(options)

        this._sections = []
        this._playHeadPosition = 0;

        this._onPlay = () => { onPlay(); }

        this._audioPlayer = new Audio()
        this._onDonePlaying = () => {}
        this._playSection = (section) => {
            this._onPlay()
            console.log("Playing section " + section.index)
            this._playHeadPosition = section.index
            this._sections.forEach((_section) => {_section.unhighlight()})
            section.highlight()
            this._onDonePlaying = (playNext=true) => {
                section.unhighlight()
                if (playNext) {
                    this._playHeadPosition += 1
                    if (this._playHeadPosition >= this._sections.length) {
                        console.log("Finished all sections")
                        this._playHeadPosition = 0
                        return
                    }
                    this._playSection(this._sections[this._playHeadPosition])
                }
            }
            this._audioPlayer.src = section.content.audio_base64wav
            this._audioPlayer.play()
        }
        this._audioPlayer.addEventListener('pause', () => { this._onDonePlaying(false) })
        this._audioPlayer.addEventListener('ended', () => { this._onDonePlaying() })
        
    }

    play(index=0) {
        if (index) {
            this._playSection(this._sections[index])
        }
        this._playSection(this._sections[0])
        this._onPlay()
    }

    stop() {
        this._audioPlayer.pause()
    }

    set(article) {
        this._sections = []
        this.element.innerHTML = ""

        if (article.title) {
            var section = new ArticleSection(this._sections.length, article.title, this._playSection, {type: 'h1'})
            this._sections.push(section)
            this.element.appendChild(section.createElement())
        }

        if (article.time) {
            var section = new ArticleSection(this._sections.length, article.time, this._playSection, {type: 'p'})
            this._sections.push(section)
            this.element.appendChild(section.createElement())
        }

        if (article.author) {
            var section = new ArticleSection(this._sections.length, article.author, this._playSection, {type: 'p'})
            this._sections.push(section)
            this.element.appendChild(section.createElement())
        }

        if (article.content) {
            article.content.forEach(
                (para) => {
                    var section = new ArticleSection(this._sections.length, para, this._playSection, {type: 'p'})
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