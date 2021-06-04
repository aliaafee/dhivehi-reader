
module.exports = function sanitizeHtml(HTML, validTags, validAttributes=[], parentTagName='div') {
    /*
     * Takes HTML string and removes all Tags and Attributes not in valid lists and returns 
     * as in element of given parentTag type. THIS IS BROKEN because it does not remove 
     * event attributes.
     */
    let htmlElem = document.createElement(parentTagName)
    htmlElem.innerHTML = HTML

    allElems = htmlElem.getElementsByTagName("*")

    for (let i = 0; i < allElems.length; i++) {
        let elem = allElems[i]
        if (elem.parentElement) {
            if (!validTags.includes(elem.tagName)) {
                elem.parentElement.removeChild(elem)
            } else {
                for (let a = 0; a < elem.attributes.length; a++) {
                    if (!validAttributes.includes(elem.attributes[a].name)) {
                        elem.removeAttribute(elem.attributes[a].name)
                    }
                }
            }
        }
    }

    htmlElem.innerHTML += " "

    return htmlElem
}